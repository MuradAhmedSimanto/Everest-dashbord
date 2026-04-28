function renderOverview() {
  const users = EverestDB.get('users', []);
  const posts = EverestDB.get('posts', []);
  const tickets = EverestDB.get('tickets', []);
  const reports = EverestDB.get('reports', []);
  const logs = EverestDB.get('activity_log', []);

  const activeUsers = users.filter(u => u.status !== 'banned').length;
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const totalFollowers = users.reduce((s, u) => s + (u.followers || 0), 0);

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const growthData = EverestDB.get('growth_data', [45,62,38,75,90,55,110,95,130,88,145,160]);

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header">
      <h1><i class="fas fa-chart-pie"></i> Overview</h1>
      <p>Welcome back, Murad Ahmed Simanto — here's what's happening on Everest.</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-users"></i></div>
        <div class="stat-value">${users.length}</div>
        <div class="stat-label">Total Users</div>
        <div class="stat-change up"><i class="fas fa-arrow-up"></i> +12% this month</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-user-check"></i></div>
        <div class="stat-value">${activeUsers}</div>
        <div class="stat-label">Active Users</div>
        <div class="stat-change up"><i class="fas fa-arrow-up"></i> +5% this week</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-newspaper"></i></div>
        <div class="stat-value">${posts.length}</div>
        <div class="stat-label">Total Posts</div>
        <div class="stat-change up"><i class="fas fa-arrow-up"></i> +23 today</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-heart"></i></div>
        <div class="stat-value">${totalFollowers.toLocaleString()}</div>
        <div class="stat-label">Total Followers</div>
        <div class="stat-change up"><i class="fas fa-arrow-up"></i> Growing</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-headset"></i></div>
        <div class="stat-value">${openTickets}</div>
        <div class="stat-label">Open Tickets</div>
        <div class="stat-change ${openTickets>5?'down':'up'}"><i class="fas fa-${openTickets>5?'arrow-up':'check'}"></i> ${openTickets>5?'Needs attention':'All good'}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-flag"></i></div>
        <div class="stat-value">${reports.filter(r=>r.status!=='resolved').length}</div>
        <div class="stat-label">Open Reports</div>
        <div class="stat-change down"><i class="fas fa-exclamation"></i> Review needed</div>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:16px;">
      <div class="card">
        <div class="card-title"><i class="fas fa-chart-bar"></i> User Growth (Monthly)</div>
        <div class="chart-area" id="growthChart"></div>
        <div style="display:flex;gap:4px;margin-top:4px;">
          ${months.map(m=>`<div style="flex:1;text-align:center;font-size:9px;color:var(--text-dim);">${m}</div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-title"><i class="fas fa-stream"></i> Recent Activity</div>
        <div style="max-height:260px;overflow-y:auto;">
          ${logs.slice(0,8).map(l=>`
            <div class="activity-item">
              <div class="activity-dot ${l.type}"></div>
              <div class="activity-text">${l.text}</div>
              <div class="activity-time">${timeAgo(l.time)}</div>
            </div>
          `).join('') || '<div class="empty-state" style="padding:20px;"><i class="fas fa-inbox"></i><p>No activity yet</p></div>'}
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-title"><i class="fas fa-users"></i> Recent Users</div>
        ${users.slice(-5).reverse().map(u=>`
          <div class="user-cell" style="margin-bottom:12px;cursor:pointer;" onclick="openUserModal('${u.id}')">
            <img src="${u.avatar||''}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=ff0000&color=fff&size=40'"/>
            <div>
              <div class="uc-name">${u.name}</div>
              <div class="uc-email">${u.email}</div>
            </div>
            <span class="badge badge-${u.status==='active'?'green':'gray'}" style="margin-left:auto;">${u.status||'Active'}</span>
          </div>
        `).join('') || '<div class="empty-state" style="padding:16px;"><p>No users yet. <a href="#" onclick="navigateTo(\'add-user\')" style="color:var(--primary);">Add one!</a></p></div>'}
      </div>
      <div class="card">
        <div class="card-title"><i class="fas fa-headset"></i> Recent Tickets</div>
        ${tickets.slice(-4).reverse().map(t=>`
          <div class="ticket-item" style="margin-bottom:8px;padding:10px;">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <span style="font-weight:700;font-size:13px;">${t.title}</span>
              <span class="badge badge-${t.status==='open'?'red':t.status==='in-progress'?'yellow':'green'}">${t.status}</span>
            </div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">${timeAgo(t.created)}</div>
          </div>
        `).join('') || '<div class="empty-state" style="padding:16px;"><i class="fas fa-check-circle" style="font-size:24px;margin-bottom:8px;display:block;"></i><p>No open tickets</p></div>'}
      </div>
    </div>
  `;

  // Render bar chart
  const maxVal = Math.max(...growthData, 1);
  const chartEl = document.getElementById('growthChart');
  if (chartEl) {
    chartEl.innerHTML = growthData.map((v, i) => `
      <div class="chart-bar" style="height:${Math.max(4,(v/maxVal)*200)}px;">
        <div class="bar-tooltip">${months[i]}: ${v}</div>
      </div>
    `).join('');
  }
}