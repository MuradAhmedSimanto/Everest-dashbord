function renderVerification() {
  const requests = EverestDB.get('verification_requests', []);
  const pending = requests.filter(r=>r.status==='pending').length;
  const approved = requests.filter(r=>r.status==='approved').length;
  const rejected = requests.filter(r=>r.status==='rejected').length;
  const users = EverestDB.get('users', []);

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header"><h1><i class="fas fa-check-circle"></i> Verification</h1><p>Review and manage user verification requests</p></div>

    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:16px;">
      <div class="stat-card"><div class="stat-icon"><i class="fas fa-clock"></i></div><div class="stat-value">${pending}</div><div class="stat-label">Pending</div></div>
      <div class="stat-card"><div class="stat-icon"><i class="fas fa-check"></i></div><div class="stat-value">${approved}</div><div class="stat-label">Approved</div></div>
      <div class="stat-card"><div class="stat-icon"><i class="fas fa-times"></i></div><div class="stat-value">${rejected}</div><div class="stat-label">Rejected</div></div>
    </div>

    <div id="verifyTabs" style="margin-bottom:16px;">
      <div class="tabs">
        <button class="tab-btn active" data-tab="vt_pending" onclick="switchTab('verifyTabs','vt_pending')">Pending (${pending})</button>
        <button class="tab-btn" data-tab="vt_approved" onclick="switchTab('verifyTabs','vt_approved')">Approved (${approved})</button>
        <button class="tab-btn" data-tab="vt_rejected" onclick="switchTab('verifyTabs','vt_rejected')">Rejected (${rejected})</button>
        <button class="tab-btn" data-tab="vt_users" onclick="switchTab('verifyTabs','vt_users')">Verified Users</button>
      </div>

      <div id="vt_pending" class="tab-pane active">
        <div style="margin-bottom:10px;">
          <button class="btn btn-primary btn-sm" onclick="openRequestVerifyModal()"><i class="fas fa-plus"></i> New Request</button>
        </div>
        ${renderVerifyCards(requests.filter(r=>r.status==='pending'), users, true)}
      </div>
      <div id="vt_approved" class="tab-pane">
        ${renderVerifyCards(requests.filter(r=>r.status==='approved'), users, false)}
      </div>
      <div id="vt_rejected" class="tab-pane">
        ${renderVerifyCards(requests.filter(r=>r.status==='rejected'), users, false)}
      </div>
      <div id="vt_users" class="tab-pane">
        ${renderVerifiedUsersList(users)}
      </div>
    </div>
  `;
}

function renderVerifyCards(requests, users, showActions) {
  if (!requests.length) return '<div class="empty-state"><i class="fas fa-check-double"></i><p>No requests in this category</p></div>';
  return `<div style="display:flex;flex-direction:column;gap:10px;">` + requests.slice().reverse().map(req => {
    const u = users.find(x=>x.id===req.userId)||{name:req.userName||'Unknown',avatar:''};
    return `
      <div class="verify-card" id="vreq_${req.id}">
        <img src="${u.avatar||''}" class="verify-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=ff0000&color=fff&size=48'"/>
        <div class="verify-info">
          <div class="verify-name">${u.name}</div>
          <div class="verify-type">Type: <strong>${req.type||'Individual'}</strong> · Submitted: ${timeAgo(req.time)}</div>
          ${req.reason?`<div style="font-size:12px;color:var(--text-muted);margin-top:4px;">"${req.reason}"</div>`:''}
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end;">
          <span class="badge badge-${req.status==='pending'?'yellow':req.status==='approved'?'green':'red'}">${req.status}</span>
          ${showActions ? `
            <div class="verify-actions" style="margin-top:6px;">
              <button class="btn btn-success btn-sm" onclick="approveVerification('${req.id}')"><i class="fas fa-check"></i> Approve</button>
              <button class="btn btn-danger btn-sm" onclick="rejectVerification('${req.id}')"><i class="fas fa-times"></i> Reject</button>
            </div>
          ` : ''}
          <button class="btn btn-danger btn-sm btn-icon" onclick="deleteVerifyReq('${req.id}')"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `;
  }).join('') + '</div>';
}

function renderVerifiedUsersList(users) {
  const verified = users.filter(u=>u.verified);
  if (!verified.length) return '<div class="empty-state"><i class="fas fa-user-check"></i><p>No verified users yet</p></div>';
  return `<div class="card"><div class="table-wrap"><table>
    <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
    <tbody>
      ${verified.map(u=>`
        <tr>
          <td><div class="user-cell">
            <img src="${u.avatar||''}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=ff0000&color=fff&size=40'"/>
            <div><div class="uc-name">${u.name} <i class="fas fa-check-circle" style="color:var(--info);font-size:11px;"></i></div><div class="uc-email">${u.email}</div></div>
          </div></td>
          <td><span class="badge badge-blue">${u.role||'User'}</span></td>
          <td><span class="badge badge-green">Verified</span></td>
          <td><button class="btn btn-outline btn-sm" onclick="revokeVerification('${u.id}')"><i class="fas fa-times"></i> Revoke</button></td>
        </tr>
      `).join('')}
    </tbody>
  </table></div></div>`;
}

function openRequestVerifyModal() {
  const users = EverestDB.get('users', []);
  openModal(`
    <div class="modal-title"><i class="fas fa-check-circle" style="color:var(--primary);margin-right:8px;"></i>New Verification Request</div>
    <div class="form-group"><label class="form-label">User</label>
      <select class="form-control" id="nv_user">
        <option value="">— Select User —</option>
        ${users.filter(u=>!u.verified).map(u=>`<option value="${u.id}">${u.name}</option>`).join('')}
      </select>
    </div>
    <div class="form-group"><label class="form-label">Verification Type</label>
      <select class="form-control" id="nv_type">
        <option>Individual</option><option>Business</option><option>Creator</option><option>Government</option><option>Media</option>
      </select>
    </div>
    <div class="form-group"><label class="form-label">Reason / Note</label><textarea class="form-control" id="nv_reason" placeholder="Why should this account be verified?"></textarea></div>
    <div style="display:flex;gap:8px;margin-top:8px;">
      <button class="btn btn-primary" onclick="saveVerifyRequest()"><i class="fas fa-save"></i> Submit</button>
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
    </div>
  `);
}

function saveVerifyRequest() {
  const userId = document.getElementById('nv_user').value;
  if (!userId) { showToast('Please select a user!', 'error'); return; }
  const users = EverestDB.get('users', []);
  const u = users.find(x=>x.id===userId);
  const requests = EverestDB.get('verification_requests', []);
  if (requests.find(r=>r.userId===userId&&r.status==='pending')) { showToast('Request already pending!', 'error'); return; }
  requests.push({ id:genId(), userId, userName:u?.name||'Unknown', type:document.getElementById('nv_type').value, reason:document.getElementById('nv_reason').value.trim(), status:'pending', time:Date.now() });
  EverestDB.set('verification_requests', requests);
  closeModal();
  showToast('Verification request submitted!', 'success');
  addNotification(`Verification request for "${u?.name}"`, 'fa-check-circle');
  logActivity(`Verification request submitted for: ${u?.name}`, 'info');
  renderVerification();
}

function approveVerification(reqId) {
  const requests = EverestDB.get('verification_requests', []);
  const req = requests.find(x=>x.id===reqId);
  if (!req) return;
  req.status = 'approved';
  EverestDB.set('verification_requests', requests);
  // Mark user as verified
  const users = EverestDB.get('users', []);
  const u = users.find(x=>x.id===req.userId);
  if (u) { u.verified = true; u.role = u.role==='User'?'Verified':u.role; EverestDB.set('users', users); }
  showToast(`${u?.name||'User'} verified!`, 'success');
  addNotification(`${u?.name} has been verified ✓`, 'fa-check-circle');
  logActivity(`Verification approved: ${u?.name}`, 'success');
  renderVerification();
}

function rejectVerification(reqId) {
  const requests = EverestDB.get('verification_requests', []);
  const req = requests.find(x=>x.id===reqId);
  if (!req) return;
  req.status = 'rejected';
  EverestDB.set('verification_requests', requests);
  showToast('Verification rejected.', 'error');
  logActivity(`Verification rejected: ${req.userName}`, 'warn');
  renderVerification();
}

function revokeVerification(userId) {
  if (!confirm('Revoke verification for this user?')) return;
  const users = EverestDB.get('users', []);
  const u = users.find(x=>x.id===userId);
  if (u) { u.verified = false; EverestDB.set('users', users); }
  showToast('Verification revoked.', 'error');
  logActivity(`Verification revoked: ${u?.name}`, 'warn');
  renderVerification();
}

function deleteVerifyReq(reqId) {
  let requests = EverestDB.get('verification_requests', []);
  requests = requests.filter(r=>r.id!==reqId);
  EverestDB.set('verification_requests', requests);
  document.getElementById('vreq_'+reqId)?.remove();
  showToast('Request deleted.', 'error');
}