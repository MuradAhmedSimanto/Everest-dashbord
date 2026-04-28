function renderUsers(filter = '') {
  let users = EverestDB.get('users', []);
  if (filter) users = users.filter(u =>
    u.name.toLowerCase().includes(filter.toLowerCase()) ||
    u.email.toLowerCase().includes(filter.toLowerCase()) ||
    (u.role||'').toLowerCase().includes(filter.toLowerCase())
  );

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header">
      <h1><i class="fas fa-users"></i> All Users</h1>
      <p>${users.length} user(s) found on Everest platform</p>
    </div>
    <div class="filter-row" style="margin-bottom:16px;">
      <input class="form-control" id="userSearchInput" placeholder="🔍 Search users..." value="${filter}" oninput="renderUsers(this.value)" style="max-width:280px;"/>
      <select class="form-control" onchange="filterUsersByRole(this.value)" style="max-width:160px;">
        <option value="">All Roles</option>
        <option>Admin</option><option>Moderator</option><option>User</option><option>Verified</option>
      </select>
      <button class="btn btn-primary btn-sm" onclick="navigateTo('add-user')"><i class="fas fa-plus"></i> Add User</button>
      <button class="btn btn-outline btn-sm" onclick="toggleView()" id="viewToggleBtn"><i class="fas fa-th"></i> Grid View</button>
    </div>
    <div id="usersContainer" class="grid-auto">
      ${users.length ? users.map(u => renderUserCard(u)).join('') : `<div class="empty-state" style="grid-column:1/-1;"><i class="fas fa-users-slash"></i><p>No users found. <button class="btn btn-primary btn-sm" onclick="navigateTo('add-user')" style="margin-top:10px;"><i class="fas fa-plus"></i> Add First User</button></p></div>`}
    </div>
  `;
}

function renderUserCard(u) {
  return `
    <div class="user-card" id="ucard_${u.id}">
      <div class="user-card-cover" style="${u.cover?`background-image:url(${u.cover});background-size:cover;background-position:center;`:''}">
        <label for="cover_${u.id}" class="cover-upload-btn" style="bottom:8px;right:8px;font-size:11px;padding:4px 10px;">
          <i class="fas fa-camera"></i> Cover
        </label>
        <input type="file" id="cover_${u.id}" accept="image/*" style="display:none" onchange="uploadUserImage('${u.id}','cover',this)"/>
      </div>
      <div class="user-card-body">
        <div class="user-card-avatar-wrap">
          <img src="${u.avatar||''}" class="user-card-avatar" id="uavatar_${u.id}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=ff0000&color=fff&size=80'"/>
          <label for="avatar_${u.id}" class="user-card-cam"><i class="fas fa-camera"></i></label>
          <input type="file" id="avatar_${u.id}" accept="image/*" style="display:none" onchange="uploadUserImage('${u.id}','avatar',this)"/>
        </div>
        <div style="display:flex;align-items:flex-start;justify-content:space-between;">
          <div>
            <div class="user-card-name">${u.name} ${u.verified?'<i class="fas fa-check-circle" style="color:var(--info);font-size:12px;"></i>':''}</div>
            <div class="user-card-role">${u.role||'User'} · ${u.email}</div>
          </div>
          <span class="badge badge-${u.status==='active'?'green':u.status==='banned'?'red':'yellow'}">${u.status||'Active'}</span>
        </div>
        <div class="user-card-stats">
          <div class="user-card-stat"><div class="ucs-val">${u.posts||0}</div><div class="ucs-key">Posts</div></div>
          <div class="user-card-stat"><div class="ucs-val">${u.followers||0}</div><div class="ucs-key">Followers</div></div>
          <div class="user-card-stat"><div class="ucs-val">${u.following||0}</div><div class="ucs-key">Following</div></div>
        </div>
        <div class="user-card-actions">
          <button class="btn btn-primary btn-sm" onclick="openUserModal('${u.id}')"><i class="fas fa-eye"></i> View</button>
          <button class="btn btn-outline btn-sm" onclick="editUser('${u.id}')"><i class="fas fa-edit"></i></button>
          <button class="btn btn-outline btn-sm" onclick="toggleBan('${u.id}')" title="${u.status==='banned'?'Unban':'Ban'}"><i class="fas fa-${u.status==='banned'?'unlock':'ban'}"></i></button>
          <button class="btn btn-danger btn-sm" onclick="deleteUser('${u.id}')"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    </div>
  `;
}

let listView = false;
function toggleView() {
  listView = !listView;
  const c = document.getElementById('usersContainer');
  const btn = document.getElementById('viewToggleBtn');
  if (listView) {
    c.className = '';
    c.style = 'display:block;';
    btn.innerHTML = '<i class="fas fa-th"></i> Grid View';
    renderUsersTable();
  } else {
    c.className = 'grid-auto';
    c.style = '';
    btn.innerHTML = '<i class="fas fa-list"></i> List View';
    renderUsers(document.getElementById('userSearchInput')?.value || '');
  }
}

function renderUsersTable() {
  const users = EverestDB.get('users', []);
  const c = document.getElementById('usersContainer');
  c.innerHTML = `
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>User</th><th>Role</th><th>Status</th><th>Posts</th><th>Followers</th><th>Joined</th><th>Actions</th>
          </tr></thead>
          <tbody>
            ${users.map(u=>`
              <tr>
                <td>
                  <div class="user-cell">
                    <img src="${u.avatar||''}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=ff0000&color=fff&size=40'"/>
                    <div><div class="uc-name">${u.name}</div><div class="uc-email">${u.email}</div></div>
                  </div>
                </td>
                <td><span class="badge badge-blue">${u.role||'User'}</span></td>
                <td><span class="badge badge-${u.status==='active'?'green':u.status==='banned'?'red':'yellow'}">${u.status||'Active'}</span></td>
                <td>${u.posts||0}</td>
                <td>${u.followers||0}</td>
                <td>${fmtDate(u.joined)}</td>
                <td>
                  <div style="display:flex;gap:4px;">
                    <button class="btn btn-outline btn-sm btn-icon" onclick="openUserModal('${u.id}')" title="View"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-outline btn-sm btn-icon" onclick="editUser('${u.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm btn-icon" onclick="deleteUser('${u.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            `).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:24px;">No users found</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function filterUsersByRole(role) {
  const users = EverestDB.get('users', []);
  const filtered = role ? users.filter(u => (u.role||'User') === role) : users;
  const c = document.getElementById('usersContainer');
  c.innerHTML = filtered.length ? filtered.map(renderUserCard).join('') : '<div class="empty-state" style="grid-column:1/-1;"><i class="fas fa-filter"></i><p>No users with this role</p></div>';
}

function uploadUserImage(userId, type, input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const users = EverestDB.get('users', []);
    const u = users.find(x => x.id === userId);
    if (!u) return;
    u[type] = e.target.result;
    EverestDB.set('users', users);
    if (type === 'avatar') {
      const el = document.getElementById('uavatar_' + userId);
      if (el) el.src = e.target.result;
    } else {
      renderUsers();
    }
    showToast(`${type.charAt(0).toUpperCase()+type.slice(1)} updated!`, 'success');
    logActivity(`Updated ${type} for user: ${u.name}`, 'success', u.name);
  };
  reader.readAsDataURL(file);
}

function renderAddUser() {
  document.getElementById('pageContent').innerHTML = `
    <div class="page-header">
      <h1><i class="fas fa-user-plus"></i> Add User</h1>
      <p>Create a new user account on Everest</p>
    </div>
    <div class="card" style="max-width:680px;">
      <div class="card-title"><i class="fas fa-id-card"></i> User Details</div>

      <!-- Cover upload -->
      <div class="cover-upload-area" id="addUserCoverArea" onclick="document.getElementById('addUserCoverInput').click()">
        <img id="addUserCoverImg" src="" style="display:none;width:100%;height:100%;object-fit:cover;"/>
        <div id="addUserCoverPlaceholder" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;color:var(--text-dim);">
          <i class="fas fa-camera" style="font-size:28px;margin-bottom:8px;"></i>
          <span style="font-size:13px;">Click to upload cover image</span>
        </div>
        <input type="file" id="addUserCoverInput" accept="image/*" style="display:none"/>
      </div>

      <!-- Avatar upload -->
      <div class="avatar-upload-wrap" style="margin-bottom:16px;">
        <div style="position:relative;display:inline-block;">
          <img id="addUserAvatarImg" src="https://ui-avatars.com/api/?name=New+User&background=ff0000&color=fff&size=80" class="avatar-upload"/>
          <label for="addUserAvatarInput" class="avatar-cam-btn"><i class="fas fa-camera"></i></label>
          <input type="file" id="addUserAvatarInput" accept="image/*" style="display:none"/>
        </div>
      </div>

      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">Full Name *</label>
          <input class="form-control" id="au_name" placeholder="Enter full name"/>
        </div>
        <div class="form-group">
          <label class="form-label">Username</label>
          <input class="form-control" id="au_username" placeholder="@username"/>
        </div>
        <div class="form-group">
          <label class="form-label">Email *</label>
          <input class="form-control" type="email" id="au_email" placeholder="user@everest.com"/>
        </div>
        <div class="form-group">
          <label class="form-label">Phone</label>
          <input class="form-control" id="au_phone" placeholder="+880..."/>
        </div>
        <div class="form-group">
          <label class="form-label">Role</label>
          <select class="form-control" id="au_role">
            <option>User</option><option>Moderator</option><option>Admin</option><option>Verified</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-control" id="au_status">
            <option value="active">Active</option><option value="pending">Pending</option><option value="banned">Banned</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Location</label>
          <input class="form-control" id="au_location" placeholder="City, Country"/>
        </div>
        <div class="form-group">
          <label class="form-label">Initial Followers</label>
          <input class="form-control" type="number" id="au_followers" placeholder="0" min="0"/>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Bio</label>
        <textarea class="form-control" id="au_bio" placeholder="User bio / description..."></textarea>
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
        <label class="toggle"><input type="checkbox" id="au_verified"/><span class="toggle-slider"></span></label>
        <span>Mark as Verified</span>
      </div>
      <div style="display:flex;gap:10px;">
        <button class="btn btn-primary" onclick="saveNewUser()"><i class="fas fa-save"></i> Create User</button>
        <button class="btn btn-outline" onclick="navigateTo('users')"><i class="fas fa-times"></i> Cancel</button>
      </div>
    </div>
  `;

  // Avatar preview
  document.getElementById('addUserAvatarInput').onchange = function() {
    const f = this.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = e => { document.getElementById('addUserAvatarImg').src = e.target.result; window._newUserAvatar = e.target.result; };
    r.readAsDataURL(f);
  };
  // Cover preview
  document.getElementById('addUserCoverInput').onchange = function() {
    const f = this.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = e => {
      document.getElementById('addUserCoverImg').src = e.target.result;
      document.getElementById('addUserCoverImg').style.display = 'block';
      document.getElementById('addUserCoverPlaceholder').style.display = 'none';
      window._newUserCover = e.target.result;
    };
    r.readAsDataURL(f);
  };
  document.getElementById('au_name').oninput = function() {
    const n = this.value; if(n) document.getElementById('addUserAvatarImg').src = window._newUserAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=ff0000&color=fff&size=80`;
  };
}

function saveNewUser() {
  const name = document.getElementById('au_name').value.trim();
  const email = document.getElementById('au_email').value.trim();
  if (!name) { showToast('Name is required!', 'error'); return; }
  if (!email) { showToast('Email is required!', 'error'); return; }

  const users = EverestDB.get('users', []);
  if (users.find(u => u.email === email)) { showToast('Email already exists!', 'error'); return; }

  const u = {
    id: genId(), name, email,
    username: document.getElementById('au_username').value.trim() || name.toLowerCase().replace(/\s+/g,'_'),
    phone: document.getElementById('au_phone').value.trim(),
    role: document.getElementById('au_role').value,
    status: document.getElementById('au_status').value,
    location: document.getElementById('au_location').value.trim(),
    bio: document.getElementById('au_bio').value.trim(),
    followers: parseInt(document.getElementById('au_followers').value) || 0,
    following: 0, posts: 0,
    verified: document.getElementById('au_verified').checked,
    avatar: window._newUserAvatar || '',
    cover: window._newUserCover || '',
    joined: Date.now()
  };
  users.push(u);
  EverestDB.set('users', users);
  window._newUserAvatar = null; window._newUserCover = null;
  logActivity(`New user created: ${u.name}`, 'success');
  addNotification(`New user "${u.name}" joined Everest`, 'fa-user-plus');
  showToast(`User "${u.name}" created!`, 'success');
  navigateTo('users');
}

function editUser(userId) {
  const users = EverestDB.get('users', []);
  const u = users.find(x => x.id === userId);
  if (!u) return;
  closeModal();
  openModal(`
    <div class="modal-title"><i class="fas fa-edit" style="color:var(--primary);margin-right:8px;"></i>Edit User</div>
    <div class="grid-2">
      <div class="form-group"><label class="form-label">Name</label><input class="form-control" id="eu_name" value="${u.name}"/></div>
      <div class="form-group"><label class="form-label">Email</label><input class="form-control" id="eu_email" value="${u.email}"/></div>
      <div class="form-group"><label class="form-label">Phone</label><input class="form-control" id="eu_phone" value="${u.phone||''}"/></div>
      <div class="form-group"><label class="form-label">Location</label><input class="form-control" id="eu_location" value="${u.location||''}"/></div>
      <div class="form-group"><label class="form-label">Role</label>
        <select class="form-control" id="eu_role">
          ${['User','Moderator','Admin','Verified'].map(r=>`<option ${u.role===r?'selected':''}>${r}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Status</label>
        <select class="form-control" id="eu_status">
          ${['active','pending','banned'].map(s=>`<option value="${s}" ${u.status===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-group"><label class="form-label">Bio</label><textarea class="form-control" id="eu_bio">${u.bio||''}</textarea></div>
    <div style="display:flex;gap:8px;margin-top:8px;">
      <button class="btn btn-primary" onclick="saveEditUser('${u.id}')"><i class="fas fa-save"></i> Save</button>
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
    </div>
  `);
}

function saveEditUser(userId) {
  const users = EverestDB.get('users', []);
  const u = users.find(x => x.id === userId);
  if (!u) return;
  u.name = document.getElementById('eu_name').value.trim() || u.name;
  u.email = document.getElementById('eu_email').value.trim() || u.email;
  u.phone = document.getElementById('eu_phone').value.trim();
  u.location = document.getElementById('eu_location').value.trim();
  u.role = document.getElementById('eu_role').value;
  u.status = document.getElementById('eu_status').value;
  u.bio = document.getElementById('eu_bio').value.trim();
  EverestDB.set('users', users);
  closeModal();
  showToast(`User "${u.name}" updated!`, 'success');
  logActivity(`Edited user: ${u.name}`, 'info');
  if (currentPage === 'users') renderUsers();
}

function toggleBan(userId) {
  const users = EverestDB.get('users', []);
  const u = users.find(x => x.id === userId);
  if (!u) return;
  u.status = u.status === 'banned' ? 'active' : 'banned';
  EverestDB.set('users', users);
  closeModal();
  showToast(`User "${u.name}" ${u.status === 'banned' ? 'banned' : 'unbanned'}!`, u.status === 'banned' ? 'error' : 'success');
  logActivity(`${u.status === 'banned' ? 'Banned' : 'Unbanned'} user: ${u.name}`, u.status === 'banned' ? 'warn' : 'success');
  if (currentPage === 'users') renderUsers();
}

function deleteUser(userId) {
  if (!confirm('Delete this user? This cannot be undone.')) return;
  let users = EverestDB.get('users', []);
  const u = users.find(x => x.id === userId);
  users = users.filter(x => x.id !== userId);
  EverestDB.set('users', users);
  closeModal();
  showToast(`User deleted.`, 'error');
  logActivity(`Deleted user: ${u?.name || userId}`, 'warn');
  if (currentPage === 'users') renderUsers();
}