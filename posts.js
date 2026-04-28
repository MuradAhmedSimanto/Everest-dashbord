// ===== POSTS =====
function renderPosts() {
  const posts = EverestDB.get('posts', []);
  const users = EverestDB.get('users', []);

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header"><h1><i class="fas fa-newspaper"></i> User Posts</h1><p>${posts.length} posts on Everest</p></div>
    <div class="filter-row">
      <button class="btn btn-primary btn-sm" onclick="openAddPostModal()"><i class="fas fa-plus"></i> New Post</button>
      <input class="form-control" placeholder="Search posts..." oninput="filterPosts(this.value)" style="max-width:260px;"/>
    </div>
    <div id="postsContainer">
      ${posts.length ? posts.slice().reverse().map(p => renderPostCard(p, users)).join('') : `<div class="empty-state"><i class="fas fa-newspaper"></i><p>No posts yet.</p></div>`}
    </div>
  `;
}

function renderPostCard(p, users) {
  const u = users.find(x => x.id === p.userId) || { name: p.author || 'Unknown', avatar: '' };
  return `
    <div class="post-card" id="pcard_${p.id}">
      <div class="post-header">
        <img src="${u.avatar||''}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=ff0000&color=fff&size=40'"/>
        <div><div class="post-author">${u.name}</div><div class="post-time">${timeAgo(p.time)}</div></div>
        <div style="margin-left:auto;display:flex;gap:6px;">
          <span class="badge badge-${p.type==='image'?'blue':p.type==='video'?'red':'gray'}">${p.type||'text'}</span>
          <button class="btn btn-danger btn-sm btn-icon" onclick="deletePost('${p.id}')"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <div class="post-text">${p.text}</div>
      ${p.image?`<img src="${p.image}" style="width:100%;max-height:300px;object-fit:cover;border-radius:8px;margin-bottom:10px;"/>`:``}
      <div class="post-stats">
        <span><i class="fas fa-heart"></i> ${p.likes||0} Likes</span>
        <span><i class="fas fa-comment"></i> ${p.comments||0} Comments</span>
        <span><i class="fas fa-share"></i> ${p.shares||0} Shares</span>
      </div>
    </div>
  `;
}

function filterPosts(q) {
  const posts = EverestDB.get('posts', []);
  const users = EverestDB.get('users', []);
  const filtered = q ? posts.filter(p => p.text.toLowerCase().includes(q.toLowerCase()) || (p.author||'').toLowerCase().includes(q.toLowerCase())) : posts;
  document.getElementById('postsContainer').innerHTML = filtered.slice().reverse().map(p => renderPostCard(p, users)).join('') || '<div class="empty-state"><i class="fas fa-search"></i><p>No posts found</p></div>';
}

function openAddPostModal() {
  const users = EverestDB.get('users', []);
  openModal(`
    <div class="modal-title"><i class="fas fa-pen" style="color:var(--primary);margin-right:8px;"></i>Create Post</div>
    <div class="form-group"><label class="form-label">Author</label>
      <select class="form-control" id="np_user">
        <option value="">— Select User —</option>
        ${users.map(u=>`<option value="${u.id}">${u.name}</option>`).join('')}
      </select>
    </div>
    <div class="form-group"><label class="form-label">Post Type</label>
      <select class="form-control" id="np_type"><option value="text">Text</option><option value="image">Image</option><option value="video">Video</option></select>
    </div>
    <div class="form-group"><label class="form-label">Content</label><textarea class="form-control" id="np_text" placeholder="What's on your mind?"></textarea></div>
    <div style="display:flex;gap:8px;margin-top:8px;">
      <button class="btn btn-primary" onclick="savePost()"><i class="fas fa-paper-plane"></i> Post</button>
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
    </div>
  `);
}

function savePost() {
  const userId = document.getElementById('np_user').value;
  const text = document.getElementById('np_text').value.trim();
  if (!text) { showToast('Post content is required!', 'error'); return; }
  const users = EverestDB.get('users', []);
  const u = users.find(x => x.id === userId);
  const posts = EverestDB.get('posts', []);
  const p = {
    id: genId(), userId, author: u?.name || 'Admin',
    text, type: document.getElementById('np_type').value,
    likes: 0, comments: 0, shares: 0, time: Date.now()
  };
  posts.push(p);
  EverestDB.set('posts', posts);
  if (u) { u.posts = (u.posts||0)+1; EverestDB.set('users', users); }
  closeModal();
  showToast('Post created!', 'success');
  logActivity(`Post created by ${u?.name||'Admin'}`, 'info');
  if (currentPage === 'posts') renderPosts();
}

function deletePost(postId) {
  if (!confirm('Delete this post?')) return;
  let posts = EverestDB.get('posts', []);
  posts = posts.filter(p => p.id !== postId);
  EverestDB.set('posts', posts);
  document.getElementById('pcard_' + postId)?.remove();
  showToast('Post deleted.', 'error');
  logActivity('Post deleted', 'warn');
}

// ===== STATISTICS =====
function renderStatistics() {
  const users = EverestDB.get('users', []);
  const posts = EverestDB.get('posts', []);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const growthData = EverestDB.get('growth_data', [45,62,38,75,90,55,110,95,130,88,145,160]);
  const maxGrow = Math.max(...growthData, 1);

  // Role distribution
  const roles = {};
  users.forEach(u => { const r = u.role||'User'; roles[r]=(roles[r]||0)+1; });
  const roleColors = { User:'#ff0000', Admin:'#ffab00', Moderator:'#00b0ff', Verified:'#00e676' };

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header"><h1><i class="fas fa-chart-line"></i> Statistics</h1><p>Platform analytics & insights</p></div>

    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon"><i class="fas fa-users"></i></div><div class="stat-value">${users.length}</div><div class="stat-label">Total Users</div></div>
      <div class="stat-card"><div class="stat-icon"><i class="fas fa-newspaper"></i></div><div class="stat-value">${posts.length}</div><div class="stat-label">Total Posts</div></div>
      <div class="stat-card"><div class="stat-icon"><i class="fas fa-heart"></i></div><div class="stat-value">${posts.reduce((s,p)=>s+(p.likes||0),0)}</div><div class="stat-label">Total Likes</div></div>
      <div class="stat-card"><div class="stat-icon"><i class="fas fa-comment"></i></div><div class="stat-value">${posts.reduce((s,p)=>s+(p.comments||0),0)}</div><div class="stat-label">Total Comments</div></div>
    </div>

    <div class="grid-2" style="margin-bottom:16px;">
      <div class="card">
        <div class="card-title"><i class="fas fa-chart-bar"></i> Monthly User Growth</div>
        <div class="chart-area" id="statsGrowthChart"></div>
        <div style="display:flex;gap:4px;margin-top:4px;">${months.map(m=>`<div style="flex:1;text-align:center;font-size:9px;color:var(--text-dim);">${m}</div>`).join('')}</div>
      </div>
      <div class="card">
        <div class="card-title"><i class="fas fa-pie-chart"></i> User Roles Distribution</div>
        <div class="pie-chart-wrap">
          <svg class="pie-chart" viewBox="0 0 42 42">
            ${renderPieChart(Object.entries(roles), Object.values(roleColors))}
          </svg>
          <div class="pie-legend">
            ${Object.entries(roles).map(([r,n],i)=>`
              <div class="pie-legend-item">
                <div class="pie-legend-dot" style="background:${Object.values(roleColors)[i]||'#ff0000'};"></div>
                <span>${r}: <strong>${n}</strong></span>
              </div>
            `).join('') || '<span style="color:var(--text-muted);">No users yet</span>'}
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title"><i class="fas fa-table"></i> Monthly Breakdown</div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Month</th><th>New Users</th><th>Posts</th><th>Growth</th></tr></thead>
          <tbody>
            ${months.map((m,i)=>`
              <tr>
                <td>${m} 2025</td>
                <td>${growthData[i]}</td>
                <td>${Math.floor(growthData[i]*2.3)}</td>
                <td>
                  <div class="progress-bar" style="width:120px;">
                    <div class="progress-fill" style="width:${(growthData[i]/maxGrow)*100}%;"></div>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const chartEl = document.getElementById('statsGrowthChart');
  if (chartEl) {
    chartEl.innerHTML = growthData.map((v,i) => `
      <div class="chart-bar" style="height:${Math.max(4,(v/maxGrow)*200)}px;">
        <div class="bar-tooltip">${months[i]}: ${v}</div>
      </div>
    `).join('');
  }
}

function renderPieChart(entries, colors) {
  if (!entries.length) return '<circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--border)" stroke-width="3"/>';
  const total = entries.reduce((s,[,v])=>s+v,0);
  let offset = 0;
  return entries.map(([,v],i)=>{
    const pct = (v/total)*100;
    const dash = `${pct} ${100-pct}`;
    const rotate = `rotate(${offset*3.6-90} 21 21)`;
    offset += pct;
    return `<circle cx="21" cy="21" r="15.9" fill="none" stroke="${colors[i]||'#ff0000'}" stroke-width="6" stroke-dasharray="${dash}" stroke-dashoffset="25" transform="${rotate}"/>`;
  }).join('') + '<circle cx="21" cy="21" r="10" fill="var(--bg-card)"/>';
}

// ===== ACTIVITY LOG =====
function renderActivity() {
  const logs = EverestDB.get('activity_log', []);
  document.getElementById('pageContent').innerHTML = `
    <div class="page-header"><h1><i class="fas fa-stream"></i> Activity Log</h1><p>${logs.length} recorded events</p></div>
    <div class="card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <div class="card-title" style="margin-bottom:0;"><i class="fas fa-history"></i> Recent Events</div>
        <button class="btn btn-danger btn-sm" onclick="clearActivityLog()"><i class="fas fa-trash"></i> Clear Log</button>
      </div>
      <div id="activityList">
        ${logs.length ? logs.map(l=>`
          <div class="activity-item">
            <div class="activity-dot ${l.type}"></div>
            <div>
              <div class="activity-text">${l.text}</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">by <span class="activity-user">${l.user||'Admin'}</span></div>
            </div>
            <div class="activity-time">${fmtDateTime(l.time)}</div>
          </div>
        `).join('') : '<div class="empty-state"><i class="fas fa-inbox"></i><p>No activity logged yet</p></div>'}
      </div>
    </div>
  `;
}

function clearActivityLog() {
  if (!confirm('Clear all activity logs?')) return;
  EverestDB.set('activity_log', []);
  showToast('Activity log cleared.', 'info');
  renderActivity();
}

// ===== SETTINGS =====
function renderSettings() {
  const s = EverestDB.get('settings', { siteName:'Everest', allowReg:true, emailNotif:true, darkMode:true, maintenanceMode:false, maxPostLen:500, maxUsersPerPage:20 });

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header"><h1><i class="fas fa-cog"></i> Settings</h1><p>Configure your Everest platform</p></div>

    <div class="grid-2">
      <div>
        <div class="card settings-section">
          <div class="card-title"><i class="fas fa-sliders-h"></i> General Settings</div>
          <div class="form-group"><label class="form-label">Platform Name</label><input class="form-control" id="s_name" value="${s.siteName}"/></div>
          <div class="form-group"><label class="form-label">Max Post Length</label><input class="form-control" type="number" id="s_postlen" value="${s.maxPostLen}"/></div>
          <div class="form-group"><label class="form-label">Users Per Page</label><input class="form-control" type="number" id="s_perpage" value="${s.maxUsersPerPage}"/></div>
          <div class="setting-row">
            <div><div class="setting-label">Allow Registrations</div><div class="setting-desc">Let new users join the platform</div></div>
            <label class="toggle"><input type="checkbox" id="s_reg" ${s.allowReg?'checked':''}/><span class="toggle-slider"></span></label>
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Email Notifications</div><div class="setting-desc">Send emails for important events</div></div>
            <label class="toggle"><input type="checkbox" id="s_email" ${s.emailNotif?'checked':''}/><span class="toggle-slider"></span></label>
          </div>
          <div class="setting-row">
            <div><div class="setting-label">Maintenance Mode</div><div class="setting-desc">Temporarily disable public access</div></div>
            <label class="toggle"><input type="checkbox" id="s_maint" ${s.maintenanceMode?'checked':''}/><span class="toggle-slider"></span></label>
          </div>
          <button class="btn btn-primary" style="margin-top:16px;" onclick="saveSettings()"><i class="fas fa-save"></i> Save Settings</button>
        </div>
      </div>
      <div>
        <div class="card settings-section">
          <div class="card-title"><i class="fas fa-chart-line"></i> Growth Data Editor</div>
          <p style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">Edit monthly user growth numbers (Jan–Dec)</p>
          <div class="grid-2" style="gap:8px;">
            ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m,i)=>`
              <div class="form-group" style="margin-bottom:8px;">
                <label class="form-label">${m}</label>
                <input class="form-control" type="number" id="gd_${i}" value="${EverestDB.get('growth_data',[45,62,38,75,90,55,110,95,130,88,145,160])[i]||0}" min="0"/>
              </div>
            `).join('')}
          </div>
          <button class="btn btn-primary" onclick="saveGrowthData()"><i class="fas fa-chart-bar"></i> Update Growth Data</button>
        </div>
        <div class="card settings-section" style="margin-top:16px;">
          <div class="card-title"><i class="fas fa-database"></i> Data Management</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-outline" onclick="exportData()"><i class="fas fa-download"></i> Export All Data</button>
            <button class="btn btn-danger" onclick="if(confirm('Clear ALL data?'))resetAllData()"><i class="fas fa-trash-alt"></i> Clear All Data</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function saveSettings() {
  const s = {
    siteName: document.getElementById('s_name').value.trim() || 'Everest',
    maxPostLen: parseInt(document.getElementById('s_postlen').value) || 500,
    maxUsersPerPage: parseInt(document.getElementById('s_perpage').value) || 20,
    allowReg: document.getElementById('s_reg').checked,
    emailNotif: document.getElementById('s_email').checked,
    maintenanceMode: document.getElementById('s_maint').checked,
  };
  EverestDB.set('settings', s);
  showToast('Settings saved!', 'success');
  logActivity('Platform settings updated', 'info');
}

function saveGrowthData() {
  const data = Array.from({length:12},(_,i)=>parseInt(document.getElementById('gd_'+i)?.value)||0);
  EverestDB.set('growth_data', data);
  showToast('Growth data updated!', 'success');
}