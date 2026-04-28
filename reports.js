function renderReports() {
  const reports = EverestDB.get('reports', []);
  const users = EverestDB.get('users', []);
  const posts = EverestDB.get('posts', []);
  const open = reports.filter(r => r.status !== 'resolved').length;
  const resolved = reports.filter(r => r.status === 'resolved').length;

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header">
      <h1><i class="fas fa-flag"></i> Reports</h1>
      <p>${reports.length} total report(s) — ${open} pending review</p>
    </div>

    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:16px;">
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-flag"></i></div>
        <div class="stat-value">${reports.length}</div>
        <div class="stat-label">Total Reports</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-exclamation-circle"></i></div>
        <div class="stat-value">${open}</div>
        <div class="stat-label">Pending</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
        <div class="stat-value">${resolved}</div>
        <div class="stat-label">Resolved</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-user-slash"></i></div>
        <div class="stat-value">${reports.filter(r=>r.type==='user').length}</div>
        <div class="stat-label">User Reports</div>
      </div>
    </div>

    <div class="filter-row">
      <button class="btn btn-primary btn-sm" onclick="openAddReportModal()">
        <i class="fas fa-plus"></i> File Report
      </button>
      <select class="form-control" style="max-width:160px;" onchange="filterReports(this.value)">
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="investigating">Investigating</option>
        <option value="resolved">Resolved</option>
      </select>
      <select class="form-control" style="max-width:160px;" onchange="filterReportsByType(this.value)">
        <option value="">All Types</option>
        <option value="user">User</option>
        <option value="post">Post</option>
        <option value="spam">Spam</option>
        <option value="harassment">Harassment</option>
        <option value="misinformation">Misinformation</option>
      </select>
    </div>

    <div id="reportsList" style="margin-top:12px;">
      ${renderReportsList(reports, users, posts)}
    </div>
  `;
}

function renderReportsList(reports, users, posts) {
  if (!reports.length) return `<div class="empty-state"><i class="fas fa-shield-alt"></i><p>No reports filed. Platform is clean! 🎉</p></div>`;
  const priorityColor = { high:'var(--danger)', medium:'var(--warning)', low:'var(--info)' };
  return reports.slice().reverse().map(r => {
    const reporter = users.find(u => u.id === r.reporterId) || { name: r.reporterName || 'Anonymous', avatar: '' };
    const target = users.find(u => u.id === r.targetId) || { name: r.targetName || 'Unknown', avatar: '' };
    return `
      <div class="report-card ${r.status==='resolved'?'resolved':''}" id="rep_${r.id}">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="width:10px;height:10px;border-radius:50%;background:${priorityColor[r.priority]||'var(--text-muted)'};flex-shrink:0;"></div>
            <div>
              <div style="font-weight:700;font-size:14px;">${r.title}</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">
                #${r.id.slice(-6).toUpperCase()} · ${r.type} · ${timeAgo(r.time)}
              </div>
            </div>
          </div>
          <div style="display:flex;gap:6px;align-items:center;flex-shrink:0;">
            <span class="badge badge-${r.priority==='high'?'red':r.priority==='medium'?'yellow':'blue'}">${r.priority||'low'}</span>
            <span class="badge badge-${r.status==='resolved'?'green':r.status==='investigating'?'yellow':'red'}">${r.status||'pending'}</span>
          </div>
        </div>

        <div style="font-size:13px;color:var(--text-muted);line-height:1.5;margin-bottom:10px;">${r.description}</div>

        <div style="display:flex;gap:16px;margin-bottom:10px;flex-wrap:wrap;">
          <div style="font-size:12px;">
            <span style="color:var(--text-muted);">Reporter: </span>
            <strong>${reporter.name}</strong>
          </div>
          <div style="font-size:12px;">
            <span style="color:var(--text-muted);">Target: </span>
            <strong style="color:var(--primary);">${target.name}</strong>
          </div>
        </div>

        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          ${r.status !== 'investigating' ? `<button class="btn btn-outline btn-sm" onclick="updateReportStatus('${r.id}','investigating')"><i class="fas fa-search"></i> Investigate</button>` : ''}
          ${r.status !== 'resolved' ? `<button class="btn btn-success btn-sm" onclick="updateReportStatus('${r.id}','resolved')"><i class="fas fa-check"></i> Resolve</button>` : ''}
          <button class="btn btn-outline btn-sm" onclick="viewReportDetail('${r.id}')"><i class="fas fa-eye"></i> Details</button>
          ${r.targetId ? `<button class="btn btn-danger btn-sm" onclick="banUserFromReport('${r.targetId}')"><i class="fas fa-ban"></i> Ban User</button>` : ''}
          <button class="btn btn-danger btn-sm btn-icon" onclick="deleteReport('${r.id}')"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `;
  }).join('');
}

function filterReports(status) {
  const reports = EverestDB.get('reports', []);
  const users = EverestDB.get('users', []);
  const posts = EverestDB.get('posts', []);
  const filtered = status ? reports.filter(r => r.status === status) : reports;
  document.getElementById('reportsList').innerHTML = renderReportsList(filtered, users, posts);
}

function filterReportsByType(type) {
  const reports = EverestDB.get('reports', []);
  const users = EverestDB.get('users', []);
  const posts = EverestDB.get('posts', []);
  const filtered = type ? reports.filter(r => r.type === type) : reports;
  document.getElementById('reportsList').innerHTML = renderReportsList(filtered, users, posts);
}

function openAddReportModal() {
  const users = EverestDB.get('users', []);
  openModal(`
    <div class="modal-title"><i class="fas fa-flag" style="color:var(--primary);margin-right:8px;"></i>File a Report</div>
    <div class="form-group">
      <label class="form-label">Report Title *</label>
      <input class="form-control" id="nr_title" placeholder="Brief title of the issue"/>
    </div>
    <div class="grid-2">
      <div class="form-group">
        <label class="form-label">Type</label>
        <select class="form-control" id="nr_type">
          <option value="user">User</option>
          <option value="post">Post</option>
          <option value="spam">Spam</option>
          <option value="harassment">Harassment</option>
          <option value="misinformation">Misinformation</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Priority</label>
        <select class="form-control" id="nr_prio">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>
    <div class="grid-2">
      <div class="form-group">
        <label class="form-label">Reporter</label>
        <select class="form-control" id="nr_reporter">
          <option value="">— Anonymous —</option>
          ${users.map(u => `<option value="${u.id}">${u.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Target User</label>
        <select class="form-control" id="nr_target">
          <option value="">— Select Target —</option>
          ${users.map(u => `<option value="${u.id}">${u.name}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Description *</label>
      <textarea class="form-control" id="nr_desc" placeholder="Describe the issue in detail..." style="min-height:100px;"></textarea>
    </div>
    <div style="display:flex;gap:8px;margin-top:8px;">
      <button class="btn btn-primary" onclick="saveReport()"><i class="fas fa-flag"></i> File Report</button>
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
    </div>
  `);
}

function saveReport() {
  const title = document.getElementById('nr_title').value.trim();
  const desc = document.getElementById('nr_desc').value.trim();
  if (!title || !desc) { showToast('Title and description required!', 'error'); return; }
  const users = EverestDB.get('users', []);
  const reporterId = document.getElementById('nr_reporter').value;
  const targetId = document.getElementById('nr_target').value;
  const ru = users.find(u => u.id === reporterId);
  const tu = users.find(u => u.id === targetId);
  const reports = EverestDB.get('reports', []);
  reports.push({
    id: genId(), title, description: desc,
    type: document.getElementById('nr_type').value,
    priority: document.getElementById('nr_prio').value,
    reporterId, reporterName: ru?.name || 'Anonymous',
    targetId, targetName: tu?.name || 'Unknown',
    status: 'pending', time: Date.now()
  });
  EverestDB.set('reports', reports);
  closeModal();
  showToast('Report filed!', 'success');
  addNotification(`New report: "${title}"`, 'fa-flag');
  logActivity(`Report filed: ${title}`, 'warn');
  renderReports();
}

function updateReportStatus(repId, status) {
  const reports = EverestDB.get('reports', []);
  const r = reports.find(x => x.id === repId);
  if (r) { r.status = status; EverestDB.set('reports', reports); }
  showToast(`Report marked as ${status}!`, status === 'resolved' ? 'success' : 'info');
  logActivity(`Report status → ${status}: ${r?.title}`, 'info');
  renderReports();
}

function viewReportDetail(repId) {
  const reports = EverestDB.get('reports', []);
  const r = reports.find(x => x.id === repId);
  if (!r) return;
  openModal(`
    <div class="modal-title"><i class="fas fa-flag" style="color:var(--primary);margin-right:8px;"></i>Report Details</div>
    <div class="user-info-grid" style="margin-bottom:16px;">
      <div class="user-info-field"><div class="uif-label">Report ID</div><div class="uif-value">#${r.id.slice(-8).toUpperCase()}</div></div>
      <div class="user-info-field"><div class="uif-label">Type</div><div class="uif-value">${r.type}</div></div>
      <div class="user-info-field"><div class="uif-label">Priority</div><div class="uif-value">${r.priority}</div></div>
      <div class="user-info-field"><div class="uif-label">Status</div><div class="uif-value">${r.status}</div></div>
      <div class="user-info-field"><div class="uif-label">Reporter</div><div class="uif-value">${r.reporterName}</div></div>
      <div class="user-info-field"><div class="uif-label">Target</div><div class="uif-value">${r.targetName}</div></div>
      <div class="user-info-field"><div class="uif-label">Filed</div><div class="uif-value">${fmtDateTime(r.time)}</div></div>
    </div>
    <div style="background:var(--bg-input);border-radius:8px;padding:14px;margin-bottom:16px;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin-bottom:6px;">Description</div>
      <div style="font-size:13px;line-height:1.6;">${r.description}</div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      ${r.status !== 'resolved' ? `<button class="btn btn-success btn-sm" onclick="updateReportStatus('${r.id}','resolved');closeModal()"><i class="fas fa-check"></i> Mark Resolved</button>` : ''}
      ${r.status !== 'investigating' ? `<button class="btn btn-outline btn-sm" onclick="updateReportStatus('${r.id}','investigating');closeModal()"><i class="fas fa-search"></i> Investigate</button>` : ''}
      <button class="btn btn-outline" onclick="closeModal()">Close</button>
    </div>
  `);
}

function banUserFromReport(userId) {
  if (!confirm('Ban this user?')) return;
  const users = EverestDB.get('users', []);
  const u = users.find(x => x.id === userId);
  if (u) { u.status = 'banned'; EverestDB.set('users', users); }
  showToast(`${u?.name || 'User'} has been banned.`, 'error');
  logActivity(`User banned from report: ${u?.name}`, 'warn');
  renderReports();
}

function deleteReport(repId) {
  if (!confirm('Delete this report?')) return;
  let reports = EverestDB.get('reports', []);
  reports = reports.filter(r => r.id !== repId);
  EverestDB.set('reports', reports);
  document.getElementById('rep_' + repId)?.remove();
  showToast('Report deleted.', 'error');
}