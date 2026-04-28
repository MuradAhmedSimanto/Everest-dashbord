function renderSupport() {
  const tickets = EverestDB.get('tickets', []);
  const open = tickets.filter(t=>t.status==='open').length;
  const inProg = tickets.filter(t=>t.status==='in-progress').length;
  const closed = tickets.filter(t=>t.status==='closed').length;

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header"><h1><i class="fas fa-headset"></i> Support Tickets</h1><p>${tickets.length} total tickets</p></div>
    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:16px;">
      <div class="stat-card"><div class="stat-icon"><i class="fas fa-envelope-open"></i></div><div class="stat-value">${open}</div><div class="stat-label">Open</div></div>
      <div class="stat-card"><div class="stat-icon"><i class="fas fa-spinner"></i></div><div class="stat-value">${inProg}</div><div class="stat-label">In Progress</div></div>
      <div class="stat-card"><div class="stat-icon"><i class="fas fa-check-circle"></i></div><div class="stat-value">${closed}</div><div class="stat-label">Closed</div></div>
    </div>
    <div class="filter-row">
      <button class="btn btn-primary btn-sm" onclick="openCreateTicketModal()"><i class="fas fa-plus"></i> Create Ticket</button>
      <select class="form-control" style="max-width:160px;" onchange="filterTickets(this.value)">
        <option value="">All Status</option>
        <option value="open">Open</option>
        <option value="in-progress">In Progress</option>
        <option value="closed">Closed</option>
      </select>
    </div>
    <div id="ticketsList">
      ${renderTicketList(tickets)}
    </div>
  `;
}

function renderTicketList(tickets) {
  const users = EverestDB.get('users', []);
  if (!tickets.length) return '<div class="empty-state"><i class="fas fa-ticket-alt"></i><p>No tickets yet</p></div>';
  return tickets.slice().reverse().map(t => {
    const u = users.find(x=>x.id===t.userId)||{name:t.userName||'Anonymous',avatar:''};
    return `
      <div class="ticket-item" id="ticket_${t.id}">
        <div class="ticket-header">
          <div>
            <div class="ticket-id">#${t.id.toUpperCase().slice(-6)}</div>
            <div class="ticket-title">${t.title}</div>
          </div>
          <div style="display:flex;gap:6px;align-items:center;flex-shrink:0;">
            <span class="badge badge-${t.priority==='high'?'red':t.priority==='medium'?'yellow':'blue'}">${t.priority||'low'}</span>
            <span class="badge badge-${t.status==='open'?'red':t.status==='in-progress'?'yellow':'green'}">${t.status}</span>
          </div>
        </div>
        <div class="ticket-body">${t.body}</div>
        <div class="ticket-footer">
          <div class="ticket-user">
            <img src="${u.avatar||''}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=333&color=fff&size=22'" style="width:22px;height:22px;border-radius:50%;"/>
            <span>${u.name}</span>
          </div>
          <span style="font-size:11px;color:var(--text-muted);">${timeAgo(t.created)}</span>
          <div style="margin-left:auto;display:flex;gap:4px;">
            ${t.status!=='in-progress'?`<button class="btn btn-outline btn-sm" onclick="updateTicketStatus('${t.id}','in-progress')"><i class="fas fa-play"></i> Start</button>`:''}
            ${t.status!=='closed'?`<button class="btn btn-success btn-sm" onclick="updateTicketStatus('${t.id}','closed')"><i class="fas fa-check"></i> Close</button>`:''}
            <button class="btn btn-danger btn-sm" onclick="deleteTicket('${t.id}')"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterTickets(status) {
  const tickets = EverestDB.get('tickets', []);
  const filtered = status ? tickets.filter(t=>t.status===status) : tickets;
  document.getElementById('ticketsList').innerHTML = renderTicketList(filtered);
}

function openCreateTicketModal() {
  const users = EverestDB.get('users', []);
  openModal(`
    <div class="modal-title"><i class="fas fa-plus" style="color:var(--primary);margin-right:8px;"></i>Create Ticket</div>
    <div class="form-group"><label class="form-label">User</label>
      <select class="form-control" id="nt_user">
        <option value="">— Anonymous —</option>
        ${users.map(u=>`<option value="${u.id}">${u.name}</option>`).join('')}
      </select>
    </div>
    <div class="form-group"><label class="form-label">Title</label><input class="form-control" id="nt_title" placeholder="Issue title..."/></div>
    <div class="form-group"><label class="form-label">Description</label><textarea class="form-control" id="nt_body" placeholder="Describe the issue..."></textarea></div>
    <div class="form-group"><label class="form-label">Priority</label>
      <select class="form-control" id="nt_prio">
        <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
      </select>
    </div>
    <div style="display:flex;gap:8px;margin-top:8px;">
      <button class="btn btn-primary" onclick="saveTicket()"><i class="fas fa-save"></i> Create</button>
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
    </div>
  `);
}

function saveTicket() {
  const title = document.getElementById('nt_title').value.trim();
  const body = document.getElementById('nt_body').value.trim();
  if (!title||!body) { showToast('Title and description required!','error'); return; }
  const userId = document.getElementById('nt_user').value;
  const users = EverestDB.get('users',[]);
  const u = users.find(x=>x.id===userId);
  const tickets = EverestDB.get('tickets',[]);
  tickets.push({ id:genId(), title, body, userId, userName:u?.name||'Anonymous', priority:document.getElementById('nt_prio').value, status:'open', created:Date.now() });
  EverestDB.set('tickets', tickets);
  closeModal();
  showToast('Ticket created!','success');
  addNotification(`New support ticket: "${title}"`, 'fa-headset');
  logActivity(`Support ticket created: ${title}`, 'info');
  renderSupport();
}

function updateTicketStatus(ticketId, status) {
  const tickets = EverestDB.get('tickets',[]);
  const t = tickets.find(x=>x.id===ticketId);
  if (t) { t.status = status; EverestDB.set('tickets', tickets); }
  showToast(`Ticket ${status}!`, status==='closed'?'success':'info');
  logActivity(`Ticket status changed to ${status}`, 'info');
  renderSupport();
}

function deleteTicket(ticketId) {
  if (!confirm('Delete this ticket?')) return;
  let tickets = EverestDB.get('tickets',[]);
  tickets = tickets.filter(t=>t.id!==ticketId);
  EverestDB.set('tickets', tickets);
  document.getElementById('ticket_'+ticketId)?.remove();
  showToast('Ticket deleted.','error');
}