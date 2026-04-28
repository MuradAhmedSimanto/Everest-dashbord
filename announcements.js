function renderAnnouncements() {
  const anns = EverestDB.get('announcements', []);

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header"><h1><i class="fas fa-bullhorn"></i> Announcements</h1><p>${anns.length} announcement(s) posted</p></div>
    <div class="filter-row">
      <button class="btn btn-primary btn-sm" onclick="openAddAnnModal()"><i class="fas fa-plus"></i> New Announcement</button>
      <select class="form-control" style="max-width:180px;" onchange="filterAnns(this.value)">
        <option value="">All Types</option>
        <option value="general">General</option>
        <option value="update">Update</option>
        <option value="maintenance">Maintenance</option>
        <option value="feature">New Feature</option>
        <option value="warning">Warning</option>
      </select>
    </div>
    <div id="annList" style="margin-top:12px;">
      ${renderAnnList(anns)}
    </div>
  `;
}

function renderAnnList(anns) {
  if (!anns.length) return '<div class="empty-state"><i class="fas fa-bullhorn"></i><p>No announcements yet. Create your first one!</p></div>';
  const typeIcons = { general:'fa-info-circle', update:'fa-sync', maintenance:'fa-tools', feature:'fa-star', warning:'fa-exclamation-triangle' };
  const typeColors = { general:'var(--info)', update:'var(--success)', maintenance:'var(--warning)', feature:'var(--primary)', warning:'var(--danger)' };
  return anns.slice().reverse().map(a => `
    <div class="announcement-item" id="ann_${a.id}">
      <div class="ann-header">
        <div class="ann-icon" style="background:${typeColors[a.type]||'var(--primary)'}22;color:${typeColors[a.type]||'var(--primary)'};">
          <i class="fas ${typeIcons[a.type]||'fa-bullhorn'}"></i>
        </div>
        <div style="flex:1;">
          <div class="ann-title">${a.title} <span class="badge badge-${a.type==='warning'?'red':a.type==='maintenance'?'yellow':a.type==='feature'?'blue':'green'}">${a.type}</span></div>
          <div class="ann-date">${fmtDateTime(a.time)} · by ${a.author||'Admin'}</div>
        </div>
        <div style="display:flex;gap:4px;">
          <button class="btn btn-outline btn-sm btn-icon" onclick="editAnn('${a.id}')"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="deleteAnn('${a.id}')"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <div class="ann-body">${a.body}</div>
      ${a.pinned?`<div style="margin-top:8px;"><span class="badge badge-red"><i class="fas fa-thumbtack"></i> Pinned</span></div>`:''}
    </div>
  `).join('');
}

function filterAnns(type) {
  const anns = EverestDB.get('announcements', []);
  const filtered = type ? anns.filter(a=>a.type===type) : anns;
  document.getElementById('annList').innerHTML = renderAnnList(filtered);
}

function openAddAnnModal() {
  openModal(`
    <div class="modal-title"><i class="fas fa-bullhorn" style="color:var(--primary);margin-right:8px;"></i>New Announcement</div>
    <div class="form-group"><label class="form-label">Title *</label><input class="form-control" id="na_title" placeholder="Announcement title"/></div>
    <div class="form-group"><label class="form-label">Type</label>
      <select class="form-control" id="na_type">
        <option value="general">General</option><option value="update">Update</option>
        <option value="maintenance">Maintenance</option><option value="feature">New Feature</option><option value="warning">Warning</option>
      </select>
    </div>
    <div class="form-group"><label class="form-label">Author</label><input class="form-control" id="na_author" value="Murad Ahmed Simanto"/></div>
    <div class="form-group"><label class="form-label">Message *</label><textarea class="form-control" id="na_body" placeholder="Announcement message..." style="min-height:120px;"></textarea></div>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
      <label class="toggle"><input type="checkbox" id="na_pinned"/><span class="toggle-slider"></span></label>
      <span>Pin this announcement</span>
    </div>
    <div style="display:flex;gap:8px;">
      <button class="btn btn-primary" onclick="saveAnn()"><i class="fas fa-paper-plane"></i> Publish</button>
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
    </div>
  `);
}

function saveAnn() {
  const title = document.getElementById('na_title').value.trim();
  const body = document.getElementById('na_body').value.trim();
  if (!title||!body) { showToast('Title and message required!', 'error'); return; }
  const anns = EverestDB.get('announcements', []);
  anns.push({ id:genId(), title, body, type:document.getElementById('na_type').value, author:document.getElementById('na_author').value.trim()||'Admin', pinned:document.getElementById('na_pinned').checked, time:Date.now() });
  EverestDB.set('announcements', anns);
  closeModal();
  showToast('Announcement published!', 'success');
  addNotification(`New announcement: "${title}"`, 'fa-bullhorn');
  logActivity(`Announcement published: ${title}`, 'info');
  renderAnnouncements();
}

function editAnn(id) {
  const anns = EverestDB.get('announcements', []);
  const a = anns.find(x=>x.id===id);
  if (!a) return;
  openModal(`
    <div class="modal-title"><i class="fas fa-edit" style="color:var(--primary);margin-right:8px;"></i>Edit Announcement</div>
    <div class="form-group"><label class="form-label">Title</label><input class="form-control" id="ea_title" value="${a.title}"/></div>
    <div class="form-group"><label class="form-label">Type</label>
      <select class="form-control" id="ea_type">
        ${['general','update','maintenance','feature','warning'].map(t=>`<option value="${t}" ${a.type===t?'selected':''}>${t}</option>`).join('')}
      </select>
    </div>
    <div class="form-group"><label class="form-label">Message</label><textarea class="form-control" id="ea_body" style="min-height:120px;">${a.body}</textarea></div>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
      <label class="toggle"><input type="checkbox" id="ea_pinned" ${a.pinned?'checked':''}/><span class="toggle-slider"></span></label>
      <span>Pinned</span>
    </div>
    <div style="display:flex;gap:8px;">
      <button class="btn btn-primary" onclick="updateAnn('${id}')"><i class="fas fa-save"></i> Save</button>
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
    </div>
  `);
}

function updateAnn(id) {
  const anns = EverestDB.get('announcements', []);
  const a = anns.find(x=>x.id===id);
  if (!a) return;
  a.title = document.getElementById('ea_title').value.trim() || a.title;
  a.body = document.getElementById('ea_body').value.trim() || a.body;
  a.type = document.getElementById('ea_type').value;
  a.pinned = document.getElementById('ea_pinned').checked;
  EverestDB.set('announcements', anns);
  closeModal();
  showToast('Announcement updated!', 'success');
  renderAnnouncements();
}

function deleteAnn(id) {
  if (!confirm('Delete this announcement?')) return;
  let anns = EverestDB.get('announcements', []);
  anns = anns.filter(a=>a.id!==id);
  EverestDB.set('announcements', anns);
  document.getElementById('ann_'+id)?.remove();
  showToast('Announcement deleted.', 'error');
}