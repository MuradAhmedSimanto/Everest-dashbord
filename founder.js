function renderFounder() {
  const f = EverestDB.get('founder', {
    name: 'Murad Ahmed Simanto',
    title: 'Founder & CEO',
    email: 'murad@everest.com',
    phone: '+880 1700-000000',
    location: 'Dhaka, Bangladesh',
    bio: 'Visionary founder of Everest Social Platform. Building the future of social media in Bangladesh and beyond.',
    twitter: '@SimantoMurad',
    website: 'everest.social',
    joined: Date.now() - 365*24*3600*1000
  });
  const avatar = EverestDB.get('founder_avatar', '');
  const cover = EverestDB.get('founder_cover', '');
  const users = EverestDB.get('users', []);

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header"><h1><i class="fas fa-crown"></i> Founder Profile</h1></div>

    <!-- Cover -->
    <div class="founder-page-cover" style="${cover?`background-image:url(${cover});background-size:cover;background-position:center;`:''}">
      ${cover?`<img src="${cover}" style="width:100%;height:100%;object-fit:cover;"/>`:``}
      <label for="founderCoverInput" class="founder-page-cover-btn">
        <i class="fas fa-camera"></i> Change Cover
      </label>
      <input type="file" id="founderCoverInput" accept="image/*" style="display:none"/>
    </div>

    <!-- Avatar + Name -->
    <div class="founder-profile-row" style="padding:0 0 0 0;">
      <div class="founder-page-avatar-wrap">
        <img src="${avatar||''}" class="founder-page-avatar" id="founderPageAvatar"
          onerror="this.src='https://ui-avatars.com/api/?name=Murad+Ahmed&background=ff0000&color=fff&size=100'"/>
        <label for="founderAvatarInput" class="founder-page-cam"><i class="fas fa-camera"></i></label>
        <input type="file" id="founderAvatarInput" accept="image/*" style="display:none"/>
      </div>
      <div class="founder-meta">
        <div class="f-name">${f.name} <i class="fas fa-crown" style="color:var(--warning);font-size:18px;"></i></div>
        <div class="f-role"><i class="fas fa-star" style="color:var(--primary);"></i> ${f.title}</div>
        <div class="f-joined">Member since ${fmtDate(f.joined)}</div>
      </div>
      <button class="btn btn-outline btn-sm" style="margin-left:auto;align-self:flex-end;margin-bottom:8px;" onclick="editFounder()"><i class="fas fa-edit"></i> Edit Profile</button>
    </div>

    <div class="grid-2" style="margin-top:24px;">
      <!-- Info -->
      <div class="card">
        <div class="card-title"><i class="fas fa-id-card"></i> Founder Info</div>
        <div class="user-info-grid">
          ${[
            ['Email', f.email],
            ['Phone', f.phone],
            ['Location', f.location],
            ['Website', f.website],
            ['Twitter', f.twitter],
            ['Platform Users', users.length],
          ].map(([k,v]) => `
            <div class="user-info-field">
              <div class="uif-label">${k}</div>
              <div class="uif-value">${v||'—'}</div>
            </div>
          `).join('')}
        </div>
        <div class="form-group" style="margin-top:16px;">
          <div class="uif-label">Bio</div>
          <p style="font-size:13px;line-height:1.6;color:var(--text-muted);margin-top:6px;">${f.bio||'No bio added.'}</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="card">
        <div class="card-title"><i class="fas fa-chart-line"></i> Platform Stats</div>
        <div class="stats-grid" style="grid-template-columns:1fr 1fr;">
          <div class="stat-card" style="padding:14px;">
            <div class="stat-icon" style="width:36px;height:36px;font-size:14px;"><i class="fas fa-users"></i></div>
            <div class="stat-value" style="font-size:24px;">${users.length}</div>
            <div class="stat-label">Total Users</div>
          </div>
          <div class="stat-card" style="padding:14px;">
            <div class="stat-icon" style="width:36px;height:36px;font-size:14px;"><i class="fas fa-newspaper"></i></div>
            <div class="stat-value" style="font-size:24px;">${EverestDB.get('posts',[]).length}</div>
            <div class="stat-label">Total Posts</div>
          </div>
          <div class="stat-card" style="padding:14px;">
            <div class="stat-icon" style="width:36px;height:36px;font-size:14px;"><i class="fas fa-headset"></i></div>
            <div class="stat-value" style="font-size:24px;">${EverestDB.get('tickets',[]).length}</div>
            <div class="stat-label">Tickets</div>
          </div>
          <div class="stat-card" style="padding:14px;">
            <div class="stat-icon" style="width:36px;height:36px;font-size:14px;"><i class="fas fa-bullhorn"></i></div>
            <div class="stat-value" style="font-size:24px;">${EverestDB.get('announcements',[]).length}</div>
            <div class="stat-label">Announcements</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Account Actions -->
    <div class="card" style="margin-top:16px;">
      <div class="card-title"><i class="fas fa-shield-alt"></i> Account Actions</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="editFounder()"><i class="fas fa-edit"></i> Edit Profile</button>
        <button class="btn btn-outline" onclick="navigateTo('settings')"><i class="fas fa-cog"></i> Settings</button>
        <button class="btn btn-outline" onclick="exportData()"><i class="fas fa-download"></i> Export Data</button>
        <button class="btn btn-danger" onclick="if(confirm('Reset ALL platform data? This cannot be undone!'))resetAllData()"><i class="fas fa-trash-alt"></i> Reset Platform Data</button>
      </div>
    </div>
  `;

  // Avatar upload
  document.getElementById('founderAvatarInput').onchange = function() {
    const f = this.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = e => {
      EverestDB.set('founder_avatar', e.target.result);
      document.getElementById('founderPageAvatar').src = e.target.result;
      refreshFounderUI();
      showToast('Profile photo updated!', 'success');
      logActivity('Founder avatar updated', 'success');
    };
    r.readAsDataURL(f);
  };
  // Cover upload
  document.getElementById('founderCoverInput').onchange = function() {
    const f2 = this.files[0]; if (!f2) return;
    const r = new FileReader();
    r.onload = e => {
      EverestDB.set('founder_cover', e.target.result);
      refreshFounderUI();
      showToast('Cover photo updated!', 'success');
      logActivity('Founder cover updated', 'success');
      renderFounder();
    };
    r.readAsDataURL(f2);
  };
}

function editFounder() {
  const f = EverestDB.get('founder', { name:'Murad Ahmed Simanto', title:'Founder & CEO', email:'murad@everest.com', phone:'', location:'Dhaka, Bangladesh', bio:'', twitter:'', website:'' });
  openModal(`
    <div class="modal-title"><i class="fas fa-crown" style="color:var(--warning);margin-right:8px;"></i>Edit Founder Profile</div>
    <div class="grid-2">
      <div class="form-group"><label class="form-label">Full Name</label><input class="form-control" id="ef_name" value="${f.name}"/></div>
      <div class="form-group"><label class="form-label">Title</label><input class="form-control" id="ef_title" value="${f.title||''}"/></div>
      <div class="form-group"><label class="form-label">Email</label><input class="form-control" id="ef_email" value="${f.email||''}"/></div>
      <div class="form-group"><label class="form-label">Phone</label><input class="form-control" id="ef_phone" value="${f.phone||''}"/></div>
      <div class="form-group"><label class="form-label">Location</label><input class="form-control" id="ef_location" value="${f.location||''}"/></div>
      <div class="form-group"><label class="form-label">Website</label><input class="form-control" id="ef_website" value="${f.website||''}"/></div>
      <div class="form-group"><label class="form-label">Twitter</label><input class="form-control" id="ef_twitter" value="${f.twitter||''}"/></div>
    </div>
    <div class="form-group"><label class="form-label">Bio</label><textarea class="form-control" id="ef_bio">${f.bio||''}</textarea></div>
    <div style="display:flex;gap:8px;margin-top:8px;">
      <button class="btn btn-primary" onclick="saveFounder()"><i class="fas fa-save"></i> Save</button>
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
    </div>
  `);
}

function saveFounder() {
  const f = {
    name: document.getElementById('ef_name').value.trim() || 'Murad Ahmed Simanto',
    title: document.getElementById('ef_title').value.trim() || 'Founder & CEO',
    email: document.getElementById('ef_email').value.trim(),
    phone: document.getElementById('ef_phone').value.trim(),
    location: document.getElementById('ef_location').value.trim(),
    website: document.getElementById('ef_website').value.trim(),
    twitter: document.getElementById('ef_twitter').value.trim(),
    bio: document.getElementById('ef_bio').value.trim(),
    joined: EverestDB.get('founder', {})?.joined || Date.now()
  };
  EverestDB.set('founder', f);
  closeModal();
  showToast('Founder profile saved!', 'success');
  logActivity('Founder profile updated', 'success');
  renderFounder();
}

function exportData() {
  const data = {
    founder: EverestDB.get('founder', {}),
    users: EverestDB.get('users', []),
    posts: EverestDB.get('posts', []),
    tickets: EverestDB.get('tickets', []),
    announcements: EverestDB.get('announcements', []),
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'everest_data_' + Date.now() + '.json';
  a.click();
  showToast('Data exported!', 'success');
}

function resetAllData() {
  ['users','posts','tickets','announcements','reports','feedback','content','activity_log','notifications','roles','verification_requests'].forEach(k => EverestDB.remove(k));
  showToast('Platform data reset!', 'error');
  navigateTo('overview');
}