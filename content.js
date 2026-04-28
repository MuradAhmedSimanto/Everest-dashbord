function renderContent() {
  const content = EverestDB.get('content', []);
  const images = content.filter(c=>c.type==='image').length;
  const videos = content.filter(c=>c.type==='video').length;
  const docs = content.filter(c=>c.type==='document').length;

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header"><h1><i class="fas fa-photo-video"></i> Content</h1><p>Manage all media & content on Everest</p></div>

    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:16px;">
      <div class="stat-card"><div class="stat-icon"><i class="fas fa-folder"></i></div><div class="stat-value">${content.length}</div><div class="stat-label">Total Content</div></div>
      <div class="stat-card"><div class="stat-icon"><i class="fas fa-image"></i></div><div class="stat-value">${images}</div><div class="stat-label">Images</div></div>
      <div class="stat-card"><div class="stat-icon"><i class="fas fa-video"></i></div><div class="stat-value">${videos}</div><div class="stat-label">Videos</div></div>
      <div class="stat-card"><div class="stat-icon"><i class="fas fa-file"></i></div><div class="stat-value">${docs}</div><div class="stat-label">Documents</div></div>
    </div>

    <div class="filter-row">
      <button class="btn btn-primary btn-sm" onclick="openAddContentModal()"><i class="fas fa-plus"></i> Add Content</button>
      <select class="form-control" style="max-width:160px;" onchange="filterContent(this.value)">
        <option value="">All Types</option>
        <option value="image">Images</option>
        <option value="video">Videos</option>
        <option value="document">Documents</option>
        <option value="link">Links</option>
      </select>
      <input class="form-control" placeholder="Search content..." oninput="searchContent(this.value)" style="max-width:240px;"/>
    </div>

    <div class="grid-auto" id="contentGrid" style="margin-top:12px;">
      ${renderContentGrid(content)}
    </div>
  `;
}

function renderContentGrid(content) {
  if (!content.length) return '<div class="empty-state" style="grid-column:1/-1;"><i class="fas fa-folder-open"></i><p>No content yet. <button class="btn btn-primary btn-sm" onclick="openAddContentModal()" style="margin-top:10px;"><i class="fas fa-plus"></i> Add Content</button></p></div>';
  return content.slice().reverse().map(c => `
    <div class="content-item" id="cont_${c.id}">
      <div class="content-thumb">
        ${c.thumbnail ? `<img src="${c.thumbnail}" style="width:100%;height:100%;object-fit:cover;"/>` :
          c.type==='image' ? '<i class="fas fa-image"></i>' :
          c.type==='video' ? '<i class="fas fa-video"></i>' :
          c.type==='document' ? '<i class="fas fa-file-alt"></i>' :
          '<i class="fas fa-link"></i>'}
      </div>
      <div class="content-info">
        <div class="content-title">${c.title}</div>
        <div class="content-meta">
          <span><i class="fas fa-tag"></i> ${c.type}</span>
          <span><i class="fas fa-clock"></i> ${timeAgo(c.time)}</span>
          <span><i class="fas fa-eye"></i> ${c.views||0} views</span>
        </div>
        ${c.description?`<div style="font-size:12px;color:var(--text-muted);margin-top:6px;line-height:1.4;">${c.description}</div>`:''}
        <div style="display:flex;gap:6px;margin-top:10px;">
          <button class="btn btn-outline btn-sm" onclick="viewContent('${c.id}')"><i class="fas fa-eye"></i> View</button>
          <button class="btn btn-danger btn-sm" onclick="deleteContent('${c.id}')"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterContent(type) {
  const content = EverestDB.get('content', []);
  const filtered = type ? content.filter(c=>c.type===type) : content;
  document.getElementById('contentGrid').innerHTML = renderContentGrid(filtered);
}

function searchContent(q) {
  const content = EverestDB.get('content', []);
  const filtered = q ? content.filter(c=>c.title.toLowerCase().includes(q.toLowerCase())||(c.description||'').toLowerCase().includes(q.toLowerCase())) : content;
  document.getElementById('contentGrid').innerHTML = renderContentGrid(filtered);
}

function openAddContentModal() {
  openModal(`
    <div class="modal-title"><i class="fas fa-plus" style="color:var(--primary);margin-right:8px;"></i>Add Content</div>
    <div class="form-group"><label class="form-label">Title *</label><input class="form-control" id="nc_title" placeholder="Content title"/></div>
    <div class="form-group"><label class="form-label">Type</label>
      <select class="form-control" id="nc_type">
        <option value="image">Image</option><option value="video">Video</option>
        <option value="document">Document</option><option value="link">Link</option>
      </select>
    </div>
    <div class="form-group"><label class="form-label">Description</label><textarea class="form-control" id="nc_desc" placeholder="Optional description..."></textarea></div>
    <div class="form-group">
      <label class="form-label">Thumbnail</label>
      <input type="file" id="nc_thumb" accept="image/*" class="form-control"/>
    </div>
    <div style="display:flex;gap:8px;margin-top:8px;">
      <button class="btn btn-primary" onclick="saveContent()"><i class="fas fa-save"></i> Save</button>
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
    </div>
  `);
}

function saveContent() {
  const title = document.getElementById('nc_title').value.trim();
  if (!title) { showToast('Title required!', 'error'); return; }
  const thumbFile = document.getElementById('nc_thumb').files[0];
  const save = (thumb) => {
    const content = EverestDB.get('content', []);
    content.push({ id:genId(), title, type:document.getElementById('nc_type').value, description:document.getElementById('nc_desc').value.trim(), thumbnail:thumb||'', views:0, time:Date.now() });
    EverestDB.set('content', content);
    closeModal();
    showToast('Content added!', 'success');
    logActivity(`Content added: ${title}`, 'info');
    renderContent();
  };
  if (thumbFile) {
    const r = new FileReader();
    r.onload = e => save(e.target.result);
    r.readAsDataURL(thumbFile);
  } else save('');
}

function viewContent(id) {
  const content = EverestDB.get('content', []);
  const c = content.find(x=>x.id===id);
  if (!c) return;
  c.views = (c.views||0)+1;
  EverestDB.set('content', content);
  openModal(`
    <div class="modal-title"><i class="fas fa-eye" style="color:var(--primary);margin-right:8px;"></i>${c.title}</div>
    ${c.thumbnail?`<img src="${c.thumbnail}" style="width:100%;max-height:300px;object-fit:cover;border-radius:10px;margin-bottom:16px;"/>`:''}
    <div class="user-info-grid">
      <div class="user-info-field"><div class="uif-label">Type</div><div class="uif-value">${c.type}</div></div>
      <div class="user-info-field"><div class="uif-label">Views</div><div class="uif-value">${c.views}</div></div>
      <div class="user-info-field"><div class="uif-label">Added</div><div class="uif-value">${fmtDate(c.time)}</div></div>
    </div>
    ${c.description?`<div style="margin-top:16px;font-size:13px;line-height:1.6;color:var(--text-muted);">${c.description}</div>`:''}
  `);
}

function deleteContent(id) {
  if (!confirm('Delete this content?')) return;
  let content = EverestDB.get('content', []);
  content = content.filter(c=>c.id!==id);
  EverestDB.set('content', content);
  document.getElementById('cont_'+id)?.remove();
  showToast('Content deleted.', 'error');
}