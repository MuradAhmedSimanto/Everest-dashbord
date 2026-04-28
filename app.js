// ========================================
// EVEREST DASHBOARD - CORE APP
// ========================================

let currentPage = 'overview';

// PAGE REGISTRY
const pages = {
  overview: renderOverview,
  users: renderUsers,
  'add-user': renderAddUser,
  'admin-table': renderAdminTable,
  founder: renderFounder,
  posts: renderPosts,
  statistics: renderStatistics,
  activity: renderActivity,
  settings: renderSettings,
  roles: renderRoles,
  support: renderSupport,
  feedback: renderFeedback,
  content: renderContent,
  announcements: renderAnnouncements,
  verification: renderVerification,
  reports: renderReports
};

function navigateTo(page) {
  currentPage = page;
  // update nav
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
  // render page
  const fn = pages[page];
  if (fn) {
    document.getElementById('pageContent').innerHTML = '';
    fn();
  }
  // log activity
  logActivity(`Navigated to ${page}`, 'info');
}

// SIDEBAR TOGGLE
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const wrapper = document.querySelector('.main-wrapper');
  sidebar.classList.toggle('collapsed');
  wrapper.classList.toggle('collapsed');
}

// MODAL
function openModal(html) {
  document.getElementById('modalBody').innerHTML = html;
  document.getElementById('mainModal').classList.add('show');
  document.getElementById('modalOverlay').classList.add('show');
}
function closeModal() {
  document.getElementById('mainModal').classList.remove('show');
  document.getElementById('modalOverlay').classList.remove('show');
}

// TOAST
function showToast(msg, type = 'info') {
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${msg}</span>`;
  document.getElementById('toastContainer').appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// NOTIFICATIONS
function addNotification(msg, icon = 'fa-bell') {
  const notifs = EverestDB.get('notifications', []);
  notifs.unshift({ id: genId(), msg, icon, time: Date.now() });
  EverestDB.set('notifications', notifs.slice(0, 50));
  renderNotifBadge();
}
function renderNotifBadge() {
  const notifs = EverestDB.get('notifications', []);
  const unread = EverestDB.get('notif_unread', notifs.length);
  document.getElementById('notifBadge').textContent = Math.min(unread, 99);
}
function toggleNotifications() {
  const dd = document.getElementById('notifDropdown');
  dd.classList.toggle('show');
  if (dd.classList.contains('show')) {
    renderNotifList();
    EverestDB.set('notif_unread', 0);
    renderNotifBadge();
  }
}
function renderNotifList() {
  const notifs = EverestDB.get('notifications', []);
  const list = document.getElementById('notifList');
  if (!notifs.length) {
    list.innerHTML = '<div class="notif-empty"><i class="fas fa-bell-slash" style="display:block;font-size:24px;margin-bottom:8px;"></i>No notifications</div>';
    return;
  }
  list.innerHTML = notifs.slice(0, 10).map(n => `
    <div class="notif-item">
      <div class="notif-icon"><i class="fas ${n.icon}"></i></div>
      <div>
        <div class="notif-text">${n.msg}</div>
        <div class="notif-time">${timeAgo(n.time)}</div>
      </div>
    </div>
  `).join('');
}
function clearAllNotifs() {
  EverestDB.set('notifications', []);
  EverestDB.set('notif_unread', 0);
  renderNotifBadge();
  renderNotifList();
}

// ACTIVITY LOG
function logActivity(text, type = 'default', user = 'Admin') {
  const logs = EverestDB.get('activity_log', []);
  logs.unshift({ id: genId(), text, type, user, time: Date.now() });
  EverestDB.set('activity_log', logs.slice(0, 200));
}

// GLOBAL SEARCH
function globalSearchFn(q) {
  const box = document.getElementById('searchResults');
  if (!q.trim()) { box.classList.remove('show'); return; }
  const users = EverestDB.get('users', []);
  const results = users.filter(u =>
    u.name.toLowerCase().includes(q.toLowerCase()) ||
    u.email.toLowerCase().includes(q.toLowerCase())
  ).slice(0, 6);
  if (!results.length) { box.classList.remove('show'); return; }
  box.innerHTML = results.map(u => `
    <div class="search-result-item" onclick="openUserModal('${u.id}');document.getElementById('searchResults').classList.remove('show');document.getElementById('globalSearch').value='';">
      <img src="${u.avatar || ''}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=ff0000&color=fff&size=40'"/>
      <div class="sr-info">
        <div class="sr-name">${u.name}</div>
        <div class="sr-role">${u.role || 'User'} · ${u.email}</div>
      </div>
    </div>
  `).join('');
  box.classList.add('show');
}

// IMAGE UPLOAD HELPER
function handleImageUpload(inputId, imgId, storageKey) {
  const input = document.getElementById(inputId);
  input.onchange = function() {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById(imgId).src = e.target.result;
      EverestDB.set(storageKey, e.target.result);
      showToast('Image updated!', 'success');
      refreshFounderUI();
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

// REFRESH FOUNDER IN SIDEBAR
function refreshFounderUI() {
  const avatar = EverestDB.get('founder_avatar', '');
  const cover = EverestDB.get('founder_cover', '');
  const el = document.getElementById('sidebarFounderAvatar');
  if (el) el.src = avatar || '';
  const topAvatar = document.getElementById('topbarAdminAvatar');
  if (topAvatar) topAvatar.src = avatar || '';
  const coverEl = document.getElementById('sidebarFounderCover');
  if (coverEl && cover) {
    coverEl.style.backgroundImage = `url(${cover})`;
    coverEl.style.backgroundSize = 'cover';
    coverEl.style.backgroundPosition = 'center';
  }
}

// CLOSE DROPDOWNS ON OUTSIDE CLICK
document.addEventListener('click', function(e) {
  if (!e.target.closest('.notification-wrap')) {
    document.getElementById('notifDropdown').classList.remove('show');
  }
  if (!e.target.closest('.search-box')) {
    document.getElementById('searchResults').classList.remove('show');
  }
  if (!e.target.closest('.action-menu')) {
    document.querySelectorAll('.action-menu-list').forEach(el => el.classList.remove('show'));
  }
});

// TAB SWITCHER
function switchTab(tabGroupId, tabId) {
  const group = document.getElementById(tabGroupId);
  if (!group) return;
  group.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
  group.querySelectorAll('.tab-pane').forEach(p => p.classList.toggle('active', p.id === tabId));
}

// OPEN USER MODAL (shared across pages)
function openUserModal(userId) {
  const users = EverestDB.get('users', []);
  const u = users.find(x => x.id === userId);
  if (!u) return;
  openModal(`
    <div class="modal-title"><i class="fas fa-user" style="color:var(--primary);margin-right:8px;"></i>${u.name}</div>
    <div style="margin-bottom:20px;">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;">
        <img src="${u.avatar||''}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=ff0000&color=fff&size=80'" style="width:64px;height:64px;border-radius:50%;object-fit:cover;border:3px solid var(--primary);"/>
        <div>
          <div style="font-size:20px;font-weight:700;">${u.name}</div>
          <div style="color:var(--text-muted);font-size:13px;">${u.email}</div>
          <span class="badge badge-${u.status==='active'?'green':u.status==='banned'?'red':'yellow'}" style="margin-top:6px;">${u.status||'Active'}</span>
        </div>
      </div>
      <div class="user-info-grid">
        ${[['Role',u.role||'User'],['Joined',fmtDate(u.joined)],['Posts',u.posts||0],['Followers',u.followers||0],['Following',u.following||0],['Location',u.location||'—'],['Phone',u.phone||'—'],['Bio',u.bio||'—']].map(([k,v])=>`
          <div class="user-info-field"><div class="uif-label">${k}</div><div class="uif-value">${v}</div></div>
        `).join('')}
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button class="btn btn-primary btn-sm" onclick="editUser('${u.id}')"><i class="fas fa-edit"></i> Edit</button>
      <button class="btn btn-outline btn-sm" onclick="toggleBan('${u.id}')"><i class="fas fa-ban"></i> ${u.status==='banned'?'Unban':'Ban'}</button>
      <button class="btn btn-danger btn-sm" onclick="deleteUser('${u.id}');closeModal()"><i class="fas fa-trash"></i> Delete</button>
    </div>
  `);
}
