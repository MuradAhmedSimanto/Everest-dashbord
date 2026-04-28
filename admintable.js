function renderAdminTable() {
  const users = EverestDB.get('users', []);
  const admins = users.filter(u => u.role === 'Admin' || u.role === 'Moderator');

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header">
      <h1><i class="fas fa-table"></i> Admin Table</h1>
      <p>All administrators and moderators on Everest</p>
    </div>

    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:16px;">
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-user-shield"></i></div>
        <div class="stat-value">${users.filter(u=>u.role==='Admin').length}</div>
        <div class="stat-label">Admins</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-user-tie"></i></div>
        <div class="stat-value">${users.filter(u=>u.role==='Moderator').length}</div>
        <div class="stat-label">Moderators</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-users-cog"></i></div>
        <div class="stat-value">${admins.length}</div>
        <div class="stat-label">Total Staff</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
        <div class="card-title" style="margin-bottom:0;"><i class="fas fa-crown"></i> Founder</div>
      </div>
      <div class="verify-card" style="border:1px solid var(--primary);background:rgba(255,0,0,0.05);">
        <img src="${EverestDB.get('founder_avatar','')||''}"
          class="verify-avatar" style="width:56px;height:56px;border:3px solid var(--primary);"
          onerror="this.src='https://ui-avatars.com/api/?name=Murad+Ahmed&background=ff0000&color=fff&size=56'"/>
        <div class="verify-info">
          <div class="verify-name" style="font-size:16px;">Murad Ahmed Simanto <i class="fas fa-crown" style="color:var(--warning);"></i></div>
          <div class="verify-type">Founder & CEO · Platform Owner</div>
          <div style="margin-top:6px;display:flex;gap:6px;">
            <span class="badge badge-red"><i class="fas fa-crown"></i> Founder</span>
            <span class="badge badge-green"><i class="fas fa-circle"></i> Online</span>
          </div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="navigateTo('founder')"><i class="fas fa-eye"></i> Profile</button>
      </div>
    </div>

    <div class="card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
        <div class="card-title" style="margin-bottom:0;"><i class="fas fa-users-cog"></i> Staff Members</div>
        <div style="display:flex;gap:8px;">
          <input class="form-control" placeholder="Search staff..." oninput="searchAdmin(this.value)" style="max-width:220px;"/>
          <button class="btn btn-primary btn-sm" onclick="openPromoteModal()"><i class="fas fa-user-plus"></i> Add Staff</button>
        </div>
      </div>

      <div class="table-wrap" id="adminTableBody">
        ${renderAdminTableBody(admins, users)}
      </div>
    </div>

    <div class="card" style="margin-top:16px;">
      <div class="card-title"><i class="fas fa-history"></i> Admin Action Log</div>
      <div style="max-height:200px;overflow-y:auto;">
        ${EverestDB.get('activity_log',[]).filter(l=>l.type==='warn'||l.type==='success').slice(0,10).map(l=>`
          <div class="activity-item">
            <div class="activity-dot ${l.type}"></div>
            <div class="activity-text">${l.text}</div>
            <div class="activity-time">${timeAgo(l.time)}</div>
          </div>
        `).join('') || '<div class="empty-state" style="padding:16px;"><p>No admin actions yet</p></div>'}
      </div>
    </div>
  `;
}

function renderAdminTableBody(admins, allUsers) {
  if (!admins.length) {
    return `<div class="empty-state"><i class="fas fa-user-slash"></i><p>No staff members yet. <button class="btn btn-primary btn-sm" onclick="openPromoteModal()" style="margin-top:10px;">Promote a User</button></p></div>`;
  }
  return `
    <table>
      <thead>
        <tr>
          <th>Staff Member</th>
          <th>Role</th>
          <th>Status</th>
          <th>Joined</th>
          <th>Posts</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${admins.map(u => `
          <tr id="arow_${u.id}">
            <td>
              <div class="user-cell">
                <img src="${u.avatar||''}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=ff0000&color=fff&size=40'"/>
                <div>
                  <div class="uc-name">${u.name} ${u.verified ? '<i class="fas fa-check-circle" style="color:var(--info);font-size:11px;"></i>' : ''}</div>
                  <div class="uc-email">${u.email}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="badge badge-${u.role==='Admin'?'red':'blue'}">
                <i class="fas fa-${u.role==='Admin'?'shield-alt':'user-tie'}"></i> ${u.role}
              </span>
            </td>
            <td>
              <span class="badge badge-${u.status==='active'?'green':u.status==='banned'?'red':'yellow'}">${u.status||'Active'}</span>
            </td>
            <td>${fmtDate(u.joined)}</td>
            <td>${u.posts || 0}</td>
            <td>
              <div style="display:flex;gap:4px;">
                <button class="btn btn-outline btn-sm btn-icon" onclick="openUserModal('${u.id}')" title="View"><i class="fas fa-eye"></i></button>
                <button class="btn btn-outline btn-sm btn-icon" onclick="editUser('${u.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm btn-icon" onclick="demoteUser('${u.id}')" title="Demote to User"><i class="fas fa-arrow-down"></i></button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function searchAdmin(q) {
  const users = EverestDB.get('users', []);
  const admins = users.filter(u => (u.role === 'Admin' || u.role === 'Moderator') &&
    (u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()))
  );
  document.getElementById('adminTableBody').innerHTML = renderAdminTableBody(admins, users);
}

function openPromoteModal() {
  const users = EverestDB.get('users', []);
  const eligible = users.filter(u => u.role !== 'Admin' && u.role !== 'Moderator');
  openModal(`
    <div class="modal-title"><i class="fas fa-user-plus" style="color:var(--primary);margin-right:8px;"></i>Promote to Staff</div>
    <div class="form-group">
      <label class="form-label">Select User</label>
      <select class="form-control" id="pu_user">
        <option value="">— Select User —</option>
        ${eligible.map(u => `<option value="${u.id}">${u.name} (${u.email})</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">New Role</label>
      <select class="form-control" id="pu_role">
        <option value="Moderator">Moderator</option>
        <option value="Admin">Admin</option>
      </select>
    </div>
    <div style="background:var(--bg-input);border-radius:8px;padding:12px;margin-bottom:16px;">
      <div style="font-size:12px;color:var(--warning);"><i class="fas fa-exclamation-triangle"></i> <strong>Warning:</strong> Admins have full platform access. Choose carefully.</div>
    </div>
    <div style="display:flex;gap:8px;">
      <button class="btn btn-primary" onclick="promoteUser()"><i class="fas fa-arrow-up"></i> Promote</button>
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
    </div>
  `);
}

function promoteUser() {
  const userId = document.getElementById('pu_user').value;
  const role = document.getElementById('pu_role').value;
  if (!userId) { showToast('Please select a user!', 'error'); return; }
  const users = EverestDB.get('users', []);
  const u = users.find(x => x.id === userId);
  if (!u) return;
  u.role = role;
  EverestDB.set('users', users);
  closeModal();
  showToast(`${u.name} promoted to ${role}!`, 'success');
  addNotification(`${u.name} promoted to ${role}`, 'fa-user-shield');
  logActivity(`${u.name} promoted to ${role}`, 'success');
  renderAdminTable();
}

function demoteUser(userId) {
  if (!confirm('Demote this staff member to regular User?')) return;
  const users = EverestDB.get('users', []);
  const u = users.find(x => x.id === userId);
  if (!u) return;
  const prevRole = u.role;
  u.role = 'User';
  EverestDB.set('users', users);
  document.getElementById('arow_' + userId)?.remove();
  showToast(`${u.name} demoted from ${prevRole}.`, 'error');
  logActivity(`${u.name} demoted from ${prevRole}`, 'warn');
  renderAdminTable();
}