/* =============================================
   EVEREST SOCIAL DASHBOARD — app.js
   All data stored in localStorage
   ============================================= */

// ─── DEFAULT FOUNDER ───────────────────────────────────────────────────────
const FOUNDER_DEFAULT = {
  name: 'Murad Ahmed Simanto',
  username: '@simanto',
  email: 'murad@everest.com',
  phone: '+880 1700-000000',
  location: 'Dhaka, Bangladesh',
  website: 'https://everest.social',
  dob: '1995-06-15',
  joined: '2021-01-12',
  bio: 'Founder & CEO of Everest Social. Building the next generation social platform for Bangladesh and beyond. 🚀',
  status: 'active',
  visibility: 'public',
  accType: 'founder',
  profilePic: '',
  coverPic: '',
  darkMode: true,
  compact: false,
  accentColor: '#ff0000',
  showFollowers: true,
  allowMsg: true,
  showStatus: true,
  social: { facebook:'', instagram:'', twitter:'', youtube:'', linkedin:'', tiktok:'', github:'', telegram:'' },
  stats: { posts:247, followers:15800, following:312, likes:48200, comments:8900, shares:3200, views:520000, saves:11200, stories:89, live:14 }
};

const SAMPLE_USERS = [
  { id:'EVR-0001', name:'Rahim Uddin', username:'@rahim_ud', email:'rahim@mail.com', phone:'+880 1800-111222', location:'Chittagong, BD', joined:'2022-03-20', status:'active', accType:'personal', bio:'Photography & travel lover.', profilePic:'', coverPic:'', stats:{ posts:84, followers:2100, following:198, likes:6200, comments:940, shares:310, views:44000, saves:890, stories:22, live:3 }, social:{facebook:'',instagram:'',twitter:'',youtube:'',linkedin:'',tiktok:'',github:'',telegram:''}, visibility:'public', showFollowers:true, allowMsg:true, showStatus:true },
  { id:'EVR-0002', name:'Nusrat Jahan', username:'@nusrat_j', email:'nusrat@mail.com', phone:'+880 1900-222333', location:'Sylhet, BD', joined:'2022-07-05', status:'away', accType:'creator', bio:'Content creator & digital artist 🎨', profilePic:'', coverPic:'', stats:{ posts:156, followers:4300, following:267, likes:18900, comments:3100, shares:880, views:142000, saves:4200, stories:67, live:8 }, social:{facebook:'',instagram:'',twitter:'',youtube:'',linkedin:'',tiktok:'',github:'',telegram:''}, visibility:'public', showFollowers:true, allowMsg:true, showStatus:true },
  { id:'EVR-0003', name:'Karim Hossain', username:'@karim_h', email:'karim@mail.com', phone:'+880 1700-333444', location:'Rajshahi, BD', joined:'2023-01-15', status:'busy', accType:'business', bio:'Entrepreneur & startup enthusiast.', profilePic:'', coverPic:'', stats:{ posts:32, followers:890, following:104, likes:2800, comments:460, shares:130, views:18000, saves:340, stories:11, live:2 }, social:{facebook:'',instagram:'',twitter:'',youtube:'',linkedin:'',tiktok:'',github:'',telegram:''}, visibility:'public', showFollowers:true, allowMsg:true, showStatus:true },
  { id:'EVR-0004', name:'Fatema Begum', username:'@fatema_b', email:'fatema@mail.com', phone:'+880 1600-444555', location:'Dhaka, BD', joined:'2021-11-08', status:'active', accType:'creator', bio:'Food blogger & recipe developer 🍜', profilePic:'', coverPic:'', stats:{ posts:210, followers:7600, following:450, likes:32000, comments:5600, shares:1900, views:288000, saves:8800, stories:134, live:19 }, social:{facebook:'',instagram:'',twitter:'',youtube:'',linkedin:'',tiktok:'',github:'',telegram:''}, visibility:'public', showFollowers:true, allowMsg:true, showStatus:true },
];

const SAMPLE_POSTS = [
  { id:'PST-001', title:'Exploring the Himalayas', content:'An incredible journey to the roof of the world. The mountains whisper stories of ancient civilizations...', category:'Travel', likes:342, comments:88, shares:45, date:'2024-11-15' },
  { id:'PST-002', title:'Top 10 Social Media Trends 2025', content:'The social media landscape is evolving rapidly. Here are the trends that will define the next era...', category:'Technology', likes:891, comments:234, shares:167, date:'2024-12-01' },
  { id:'PST-003', title:'Building Community on Everest', content:'Community is the heart of every great platform. Here is how we are doing it differently at Everest...', category:'Business', likes:612, comments:145, shares:98, date:'2025-01-08' },
  { id:'PST-004', title:'Digital Bangladesh: Our Vision', content:'We believe every Bangladeshi deserves access to world-class social tools. This is our mission...', category:'Business', likes:1204, comments:312, shares:420, date:'2025-02-20' },
  { id:'PST-005', title:'Meet the Founders Story', content:'Starting Everest was not easy. Here is the untold story of how three friends built something from scratch...', category:'Lifestyle', likes:2876, comments:678, shares:934, date:'2025-03-10' },
];

const SAMPLE_NOTIFS = [
  { id:1, icon:'fas fa-user-plus', title:'New User Registered', msg:'Fatema Begum just joined Everest', time:'2 min ago', unread:true },
  { id:2, icon:'fas fa-heart', title:'Post Hit 1K Likes!', msg:'"Digital Bangladesh" reached 1,204 likes', time:'1 hour ago', unread:true },
  { id:3, icon:'fas fa-comment', title:'New Comment', msg:'Rahim Uddin commented on your post', time:'3 hours ago', unread:true },
  { id:4, icon:'fas fa-share-alt', title:'Post Shared', msg:'Your latest post was shared 50 times', time:'1 day ago', unread:false },
  { id:5, icon:'fas fa-mountain', title:'Milestone Reached', msg:'Everest now has 10,000+ active users!', time:'2 days ago', unread:false },
];

const SAMPLE_MSGS = [
  { id:1, from:'Rahim Uddin', preview:'Hey! Loved your recent post about the Himalayas…', time:'10:32 AM' },
  { id:2, from:'Nusrat Jahan', preview:'Can we collaborate on the next content series?', time:'Yesterday' },
  { id:3, from:'Karim Hossain', preview:'Is there a business account upgrade path?', time:'Mon' },
  { id:4, from:'Fatema Begum', preview:'Thank you for featuring my recipe post! 🙌', time:'Sun' },
];

// ─── STORE ─────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const qs = s => document.querySelector(s);

function lsGet(key, def) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; }
}
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

// ─── STATE ─────────────────────────────────────────────────────────────────
let founder = lsGet('ev_founder', FOUNDER_DEFAULT);
let users   = lsGet('ev_users',   SAMPLE_USERS);
let posts   = lsGet('ev_posts',   SAMPLE_POSTS);
let notifs  = lsGet('ev_notifs',  SAMPLE_NOTIFS);
let msgs    = lsGet('ev_msgs',    SAMPLE_MSGS);

let editingUserId = null;
let newUserPicData = '';
let newUserCoverData = '';
let growthChart, engagementChart, monthlyChart, statusPieChart;

// ─── INIT ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(founder.darkMode);
  renderSidebarFounder();
  renderTopbarAvatar();
  renderDashboard();
  renderAnalytics();
  renderPosts();
  renderUsers();
  renderMessages();
  renderNotifications();
  fillSettings();
  setupNav();
  setupSearch();
  setupSettingsTabs();
  setupModals();
  setupImageUploads();
  setupThemeBtn();
  setupHamburger();
  setupUserFilter();
  buildCharts();
});

// ─── THEME ─────────────────────────────────────────────────────────────────
function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  const icon = $('themeIcon'), lbl = $('themeLabel');
  if (icon) icon.className = dark ? 'fas fa-moon' : 'fas fa-sun';
  if (lbl) lbl.textContent = dark ? 'Dark Mode' : 'Light Mode';
  const sd = $('sDarkMode'); if (sd) sd.checked = dark;
}

function setupThemeBtn() {
  $('themeBtn').addEventListener('click', () => {
    founder.darkMode = !founder.darkMode;
    lsSet('ev_founder', founder);
    applyTheme(founder.darkMode);
    toast(founder.darkMode ? '🌙 Dark mode on' : '☀️ Light mode on', 'info');
  });
}

// ─── SIDEBAR FOUNDER ───────────────────────────────────────────────────────
function renderSidebarFounder() {
  const pic = $('sfPic');
  pic.src = founder.profilePic || makeAvatar(founder.name, 42);
  $('sfName').textContent = founder.name;
  const dot = $('sfDot');
  dot.className = 'sdot ' + (founder.status !== 'active' ? founder.status : '');
  $('sfStatusTxt').textContent = cap(founder.status);
  const cover = $('sfCover');
  if (founder.coverPic) { cover.style.backgroundImage = `url(${founder.coverPic})`; cover.style.backgroundSize='cover'; }
  else { cover.style.backgroundImage=''; }
}

function renderTopbarAvatar() {
  const img = $('topAvatarImg');
  img.src = founder.profilePic || makeAvatar(founder.name, 38);
}

// ─── DASHBOARD ─────────────────────────────────────────────────────────────
function renderDashboard() {
  const welcome = $('dashWelcome');
  if (welcome) welcome.textContent = founder.name.split(' ')[0];

  const stats = founder.stats;
  const row = $('statsRow');
  const cards = [
    { icon:'fas fa-file-alt', val: stats.posts,     lbl:'Total Posts',  change:'+12%' },
    { icon:'fas fa-user-friends', val: stats.followers, lbl:'Followers', change:'+8.4%' },
    { icon:'fas fa-user-plus', val: stats.following, lbl:'Following',    change:'+2.1%' },
    { icon:'fas fa-heart',     val: stats.likes,     lbl:'Total Likes',  change:'+21%' },
    { icon:'fas fa-comment',   val: stats.comments,  lbl:'Comments',     change:'+6%' },
    { icon:'fas fa-share-alt', val: stats.shares,    lbl:'Shares',       change:'+14%' },
    { icon:'fas fa-eye',       val: stats.views,     lbl:'Views',        change:'+34%' },
    { icon:'fas fa-bookmark',  val: stats.saves,     lbl:'Saves',        change:'+9%' },
    { icon:'fas fa-users',     val: users.length,    lbl:'Total Users',  change:'+1' },
    { icon:'fas fa-newspaper', val: posts.length,    lbl:'Posts Today',  change:'New' },
  ];
  row.innerHTML = cards.map(c => `
    <div class="stat-card">
      <div class="sc-icon"><i class="${c.icon}"></i></div>
      <div class="sc-val">${fmtNum(c.val)}</div>
      <div class="sc-lbl">${c.lbl}</div>
      <div class="sc-change up"><i class="fas fa-arrow-up"></i> ${c.change}</div>
    </div>
  `).join('');

  renderRecentUsers();
}

function renderRecentUsers() {
  const wrap = $('recentUsersTable');
  const recent = [...users].slice(0, 6);
  if (!recent.length) { wrap.innerHTML = '<p style="padding:20px;color:var(--text3)">No users yet.</p>'; return; }
  wrap.innerHTML = `<table>
    <thead><tr><th>User</th><th>Email</th><th>Posts</th><th>Followers</th><th>Status</th></tr></thead>
    <tbody>${recent.map(u => `
      <tr onclick="openUserDetail('${u.id}')" style="cursor:pointer">
        <td><div class="table-user">
          <div class="table-pic">${u.profilePic ? `<img src="${u.profilePic}" style="width:32px;height:32px;border-radius:50%;object-fit:cover">` : initials(u.name)}</div>
          <div><div class="table-name">${esc(u.name)}</div><div class="table-id">${u.id}</div></div>
        </div></td>
        <td>${esc(u.email)}</td>
        <td>${fmtNum(u.stats.posts)}</td>
        <td>${fmtNum(u.stats.followers)}</td>
        <td><span class="status-badge ${u.status}">${cap(u.status)}</span></td>
      </tr>`).join('')}
    </tbody>
  </table>`;
}

// ─── ANALYTICS ─────────────────────────────────────────────────────────────
function renderAnalytics() {
  const s = founder.stats;
  const grid = $('analyticsGrid');
  const cards = [
    { icon:'fas fa-eye', val:s.views, lbl:'Total Views' },
    { icon:'fas fa-heart', val:s.likes, lbl:'Total Likes' },
    { icon:'fas fa-comment', val:s.comments, lbl:'Comments' },
    { icon:'fas fa-share-alt', val:s.shares, lbl:'Shares' },
    { icon:'fas fa-bookmark', val:s.saves, lbl:'Saves' },
    { icon:'fas fa-video', val:s.stories, lbl:'Stories' },
    { icon:'fas fa-broadcast-tower', val:s.live, lbl:'Live Sessions' },
    { icon:'fas fa-users', val:users.length, lbl:'Users' },
    { icon:'fas fa-newspaper', val:posts.length, lbl:'Posts' },
    { icon:'fas fa-chart-line', val: s.followers > 1000 ? (s.followers/1000).toFixed(1)+'K' : s.followers, lbl:'Followers' },
  ];
  grid.innerHTML = cards.map(c => `
    <div class="analytics-card">
      <div class="ac-icon"><i class="${c.icon}"></i></div>
      <div class="ac-val">${typeof c.val==='number'?fmtNum(c.val):c.val}</div>
      <div class="ac-lbl">${c.lbl}</div>
    </div>
  `).join('');
}

// ─── POSTS ─────────────────────────────────────────────────────────────────
function renderPosts() {
  const container = $('postsContainer');
  if (!posts.length) {
    container.innerHTML = `<div class="empty-state"><i class="fas fa-newspaper"></i><p>No posts yet. Create your first post!</p></div>`;
    return;
  }
  container.innerHTML = posts.map(p => `
    <div class="post-card">
      <div class="post-cat">${esc(p.category)}</div>
      <div class="post-title">${esc(p.title)}</div>
      <div class="post-content">${esc(p.content)}</div>
      <div class="post-stats-row">
        <span class="post-stat"><i class="fas fa-heart"></i>${fmtNum(p.likes)}</span>
        <span class="post-stat"><i class="fas fa-comment"></i>${fmtNum(p.comments)}</span>
        <span class="post-stat"><i class="fas fa-share-alt"></i>${fmtNum(p.shares)}</span>
      </div>
      <div class="post-footer">
        <span class="post-date">${fmtDate(p.date)}</span>
        <button class="post-del-btn" onclick="deletePost('${p.id}')"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');
}

window.deletePost = function(id) {
  confirm2('Delete this post?', 'This action cannot be undone.', () => {
    posts = posts.filter(p => p.id !== id);
    lsSet('ev_posts', posts);
    renderPosts();
    toast('🗑 Post deleted', 'error');
  });
};

function openAddPostModal() { openModal('addPostModal'); }
window.openAddPostModal = openAddPostModal;

window.savePost = function() {
  const title = $('npTitle').value.trim();
  if (!title) { toast('⚠️ Post title required!', 'error'); return; }
  const p = {
    id: 'PST-' + String(posts.length + 1).padStart(3, '0'),
    title,
    content: $('npContent').value.trim(),
    category: $('npCat').value,
    likes: parseInt($('npLikes').value) || 0,
    comments: parseInt($('npComments').value) || 0,
    shares: parseInt($('npShares').value) || 0,
    date: new Date().toISOString().split('T')[0]
  };
  posts.unshift(p);
  lsSet('ev_posts', posts);
  renderPosts();
  closeModal('addPostModal');
  ['npTitle','npContent','npLikes','npComments','npShares'].forEach(id => $(id).value = '');
  toast('✅ Post published!', 'success');
};

// ─── USERS ─────────────────────────────────────────────────────────────────
function renderUsers(filter = 'all') {
  const grid = $('usersGrid');
  const lbl  = $('userCountLabel');
  let list = filter === 'all' ? users : users.filter(u => u.status === filter);
  if (lbl) lbl.textContent = `${users.length} user${users.length !== 1 ? 's' : ''} registered`;

  if (!list.length) {
    grid.innerHTML = `<div class="empty-state"><i class="fas fa-users"></i><p>No users found.</p></div>`;
    return;
  }
  grid.innerHTML = list.map(u => {
    const picHTML = u.profilePic
      ? `<img class="uc-pic" src="${u.profilePic}" style="display:block">`
      : `<div class="uc-pic">${initials(u.name)}</div>`;
    const covStyle = u.coverPic ? `background-image:url(${u.coverPic});background-size:cover;background-position:center` : '';
    return `
    <div class="user-card" data-id="${u.id}">
      <div class="uc-cover" style="${covStyle}"></div>
      <div class="uc-body">
        <div class="uc-pic-wrap">${picHTML}</div>
        <div class="uc-name">${esc(u.name)}</div>
        <div class="uc-id">${u.id} · ${esc(u.username||'')}</div>
        <div class="uc-email">${esc(u.email)}</div>
        <div class="uc-stats">
          <div class="uc-stat"><div class="uc-stat-val">${fmtNum(u.stats.posts)}</div><div class="uc-stat-lbl">Posts</div></div>
          <div class="uc-stat"><div class="uc-stat-val">${fmtNum(u.stats.followers)}</div><div class="uc-stat-lbl">Followers</div></div>
          <div class="uc-stat"><div class="uc-stat-val">${fmtNum(u.stats.following)}</div><div class="uc-stat-lbl">Following</div></div>
        </div>
        <div class="uc-footer">
          <span class="status-badge ${u.status}">${cap(u.status)}</span>
          <div class="uc-actions">
            <button class="uc-btn view-btn" onclick="openUserDetail('${u.id}')"><i class="fas fa-eye"></i> View</button>
            <button class="uc-btn" onclick="openEditUser('${u.id}')" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="uc-btn danger" onclick="deleteUser('${u.id}')" title="Delete"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

function setupUserFilter() {
  $('userStatusFilter').addEventListener('change', e => renderUsers(e.target.value));
}

window.deleteUser = function(id) {
  confirm2('Delete this user?', 'All user data will be permanently removed.', () => {
    users = users.filter(u => u.id !== id);
    lsSet('ev_users', users);
    renderUsers();
    renderRecentUsers();
    renderDashboard();
    toast('🗑 User deleted', 'error');
  });
};

// ─── USER DETAIL MODAL ─────────────────────────────────────────────────────
window.openUserDetail = function(id) {
  const u = users.find(x => x.id === id);
  if (!u) return;
  $('udmTitle').textContent = 'User Profile — ' + u.id;
  const picHTML = u.profilePic
    ? `<img class="udm-pic" src="${u.profilePic}" style="display:block">`
    : `<div class="udm-pic">${initials(u.name)}</div>`;
  const covStyle = u.coverPic ? `background-image:url(${u.coverPic});background-size:cover;background-position:center` : '';
  const s = u.stats;
  const details = [
    { label:'Username', val: u.username || '—' },
    { label:'Email', val: u.email },
    { label:'Phone', val: u.phone || '—' },
    { label:'Location', val: u.location || '—' },
    { label:'Joined', val: fmtDate(u.joined) },
    { label:'Account Type', val: cap(u.accType || 'personal') },
    { label:'Visibility', val: cap(u.visibility || 'public') },
    { label:'Likes', val: fmtNum(s.likes) },
    { label:'Comments', val: fmtNum(s.comments) },
    { label:'Shares', val: fmtNum(s.shares) },
    { label:'Views', val: fmtNum(s.views) },
    { label:'Saves', val: fmtNum(s.saves) },
    { label:'Stories', val: fmtNum(s.stories) },
    { label:'Live Sessions', val: fmtNum(s.live) },
  ];
  const socialLinks = u.social ? Object.entries({
    facebook:{icon:'fab fa-facebook',color:'#1877f2'},
    instagram:{icon:'fab fa-instagram',color:'#e1306c'},
    twitter:{icon:'fab fa-twitter',color:'#1da1f2'},
    youtube:{icon:'fab fa-youtube',color:'#ff0000'},
    linkedin:{icon:'fab fa-linkedin',color:'#0a66c2'},
    tiktok:{icon:'fab fa-tiktok',color:'#fff'},
    github:{icon:'fab fa-github',color:'#fff'},
    telegram:{icon:'fab fa-telegram',color:'#229ed9'},
  }).filter(([k]) => u.social[k]).map(([k,v]) => `
    <a class="social-link-pill" href="${esc(u.social[k])}" target="_blank">
      <i class="${v.icon}" style="color:${v.color}"></i>${cap(k)}
    </a>`).join('') : '';

  $('userDetailBody').innerHTML = `
    <div class="udm-cover" style="${covStyle}"></div>
    <div class="udm-pic-row">
      ${picHTML}
      <div class="udm-name-block">
        <div class="udm-name">${esc(u.name)}</div>
        <div class="udm-id">${u.id} · ${esc(u.username||'')} · <span class="status-badge ${u.status}" style="font-size:0.65rem">${cap(u.status)}</span></div>
        ${u.bio ? `<p style="font-size:0.82rem;color:var(--text2);margin-top:6px;line-height:1.4">${esc(u.bio)}</p>` : ''}
      </div>
    </div>
    <div class="udm-stats">
      <div class="udm-stat"><div class="udm-stat-val">${fmtNum(s.posts)}</div><div class="udm-stat-lbl">Posts</div></div>
      <div class="udm-stat"><div class="udm-stat-val">${fmtNum(s.followers)}</div><div class="udm-stat-lbl">Followers</div></div>
      <div class="udm-stat"><div class="udm-stat-val">${fmtNum(s.following)}</div><div class="udm-stat-lbl">Following</div></div>
      <div class="udm-stat"><div class="udm-stat-val">${fmtNum(s.likes)}</div><div class="udm-stat-lbl">Likes</div></div>
      <div class="udm-stat"><div class="udm-stat-val">${fmtNum(s.views)}</div><div class="udm-stat-lbl">Views</div></div>
    </div>
    <div class="udm-grid">${details.map(d => `
      <div class="udm-detail-item"><div class="udm-detail-label">${d.label}</div><div class="udm-detail-val">${esc(String(d.val))}</div></div>
    `).join('')}</div>
    ${socialLinks ? `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">${socialLinks}</div>` : ''}
  `;
  $('userDetailFooter').innerHTML = `
    <button class="btn-outline" onclick="closeModal('userDetailModal')">Close</button>
    <button class="btn-outline" onclick="closeModal('userDetailModal');openEditUser('${u.id}')"><i class="fas fa-edit"></i> Edit</button>
    <button class="btn-danger" onclick="closeModal('userDetailModal');deleteUser('${u.id}')"><i class="fas fa-trash"></i> Delete</button>
  `;
  openModal('userDetailModal');
};

// ─── ADD USER MODAL ─────────────────────────────────────────────────────────
function openAddUserModal() {
  newUserPicData = '';
  newUserCoverData = '';
  $('newUserPicPreview').src = makeAvatar('New User', 72);
  $('newUserCoverPreview').style.backgroundImage = '';
  openModal('addUserModal');
}
window.openAddUserModal = openAddUserModal;

window.saveNewUser = function() {
  const name = $('nuName').value.trim();
  const email = $('nuEmail').value.trim();
  if (!name || !email) { toast('⚠️ Name and Email required!', 'error'); return; }
  const nextNum = String(users.length + 1).padStart(4, '0');
  const u = {
    id: 'EVR-' + nextNum,
    name, email,
    username: $('nuUsername').value.trim() || '@' + name.toLowerCase().replace(/\s+/g,'_'),
    phone: $('nuPhone').value.trim(),
    location: $('nuLocation').value.trim(),
    joined: $('nuJoined').value || new Date().toISOString().split('T')[0],
    status: $('nuStatus').value,
    accType: $('nuAccType').value,
    bio: $('nuBio').value.trim(),
    profilePic: newUserPicData,
    coverPic: newUserCoverData,
    stats: {
      posts: parseInt($('nuPosts').value) || 0,
      followers: parseInt($('nuFollowers').value) || 0,
      following: parseInt($('nuFollowing').value) || 0,
      likes: parseInt($('nuLikes').value) || 0,
      comments: 0, shares: 0, views: 0, saves: 0, stories: 0, live: 0
    },
    social: { facebook:'', instagram:'', twitter:'', youtube:'', linkedin:'', tiktok:'', github:'', telegram:'' },
    visibility: 'public', showFollowers: true, allowMsg: true, showStatus: true
  };
  users.unshift(u);
  lsSet('ev_users', users);
  renderUsers();
  renderRecentUsers();
  renderDashboard();
  renderAnalytics();
  closeModal('addUserModal');
  // clear
  ['nuName','nuUsername','nuEmail','nuPhone','nuLocation','nuPosts','nuFollowers','nuFollowing','nuLikes','nuBio'].forEach(id => $(id).value = '');
  newUserPicData = '';
  newUserCoverData = '';
  toast(`✅ ${name} added!`, 'success');
  notifs.unshift({ id: Date.now(), icon:'fas fa-user-plus', title:'New User Added', msg:`${name} joined Everest`, time:'Just now', unread:true });
  lsSet('ev_notifs', notifs);
  renderNotifications();
  updateNotifBadge();
};

// ─── EDIT USER ──────────────────────────────────────────────────────────────
window.openEditUser = function(id) {
  const u = users.find(x => x.id === id);
  if (!u) return;
  editingUserId = id;
  const s = u.stats;
  $('editUserBody').innerHTML = `
    <div class="modal-pic-row" style="margin-bottom:18px">
      <div class="modal-pic-preview-wrap">
        <img id="euPicPreview" src="${u.profilePic || makeAvatar(u.name,72)}" class="modal-pic-preview"/>
        <label class="modal-pic-label" for="euPicInput"><i class="fas fa-camera"></i></label>
        <input type="file" id="euPicInput" accept="image/*" hidden/>
      </div>
      <div class="modal-cover-preview-wrap">
        <div class="modal-cover-preview" id="euCoverPreview" style="${u.coverPic?`background-image:url(${u.coverPic});background-size:cover;background-position:center`:''}"></div>
        <label class="modal-cover-label" for="euCoverInput"><i class="fas fa-image"></i> Cover</label>
        <input type="file" id="euCoverInput" accept="image/*" hidden/>
      </div>
    </div>
    <div class="form-grid">
      <div class="form-group"><label>Full Name</label><input id="euName" value="${esc(u.name)}"/></div>
      <div class="form-group"><label>Username</label><input id="euUsername" value="${esc(u.username||'')}"/></div>
      <div class="form-group"><label>Email</label><input id="euEmail" type="email" value="${esc(u.email)}"/></div>
      <div class="form-group"><label>Phone</label><input id="euPhone" value="${esc(u.phone||'')}"/></div>
      <div class="form-group"><label>Location</label><input id="euLocation" value="${esc(u.location||'')}"/></div>
      <div class="form-group"><label>Joined</label><input id="euJoined" type="date" value="${u.joined||''}"/></div>
      <div class="form-group"><label>Status</label><select id="euStatus">
        <option value="active" ${u.status==='active'?'selected':''}>🟢 Active</option>
        <option value="away" ${u.status==='away'?'selected':''}>🟡 Away</option>
        <option value="busy" ${u.status==='busy'?'selected':''}>🔴 Busy</option>
        <option value="offline" ${u.status==='offline'?'selected':''}>⚫ Offline</option>
      </select></div>
      <div class="form-group"><label>Account Type</label><select id="euAccType">
        <option value="personal" ${u.accType==='personal'?'selected':''}>Personal</option>
        <option value="business" ${u.accType==='business'?'selected':''}>Business</option>
        <option value="creator" ${u.accType==='creator'?'selected':''}>Creator</option>
      </select></div>
      <div class="form-group"><label>Posts</label><input id="euPosts" type="number" value="${s.posts}"/></div>
      <div class="form-group"><label>Followers</label><input id="euFollowers" type="number" value="${s.followers}"/></div>
      <div class="form-group"><label>Following</label><input id="euFollowing" type="number" value="${s.following}"/></div>
      <div class="form-group"><label>Likes</label><input id="euLikes" type="number" value="${s.likes}"/></div>
      <div class="form-group"><label>Comments</label><input id="euComments" type="number" value="${s.comments}"/></div>
      <div class="form-group"><label>Shares</label><input id="euShares" type="number" value="${s.shares}"/></div>
      <div class="form-group"><label>Views</label><input id="euViews" type="number" value="${s.views}"/></div>
      <div class="form-group"><label>Saves</label><input id="euSaves" type="number" value="${s.saves}"/></div>
      <div class="form-group"><label>Stories</label><input id="euStories" type="number" value="${s.stories}"/></div>
      <div class="form-group"><label>Live Sessions</label><input id="euLive" type="number" value="${s.live}"/></div>
      <div class="form-group full"><label>Bio</label><textarea id="euBio" rows="2">${esc(u.bio||'')}</textarea></div>
      <div class="form-group"><label><i class="fab fa-facebook" style="color:#1877f2"></i> Facebook</label><input id="euFacebook" value="${esc(u.social?.facebook||'')}"/></div>
      <div class="form-group"><label><i class="fab fa-instagram" style="color:#e1306c"></i> Instagram</label><input id="euInstagram" value="${esc(u.social?.instagram||'')}"/></div>
      <div class="form-group"><label><i class="fab fa-twitter" style="color:#1da1f2"></i> Twitter</label><input id="euTwitter" value="${esc(u.social?.twitter||'')}"/></div>
      <div class="form-group"><label><i class="fab fa-youtube" style="color:#ff0000"></i> YouTube</label><input id="euYoutube" value="${esc(u.social?.youtube||'')}"/></div>
    </div>
  `;
  // image handlers for edit
  setTimeout(() => {
    $('euPicInput')?.addEventListener('change', e => {
      readImg(e.target.files[0], src => {
        $('euPicPreview').src = src;
        const u2 = users.find(x=>x.id===editingUserId);
        if(u2) u2.profilePic = src;
      });
    });
    $('euCoverInput')?.addEventListener('change', e => {
      readImg(e.target.files[0], src => {
        $('euCoverPreview').style.backgroundImage = `url(${src})`;
        $('euCoverPreview').style.backgroundSize = 'cover';
        const u2 = users.find(x=>x.id===editingUserId);
        if(u2) u2.coverPic = src;
      });
    });
  }, 100);
  openModal('editUserModal');
};

window.saveEditUser = function() {
  const idx = users.findIndex(x => x.id === editingUserId);
  if (idx === -1) return;
  const u = users[idx];
  u.name = $('euName').value.trim() || u.name;
  u.username = $('euUsername').value.trim();
  u.email = $('euEmail').value.trim() || u.email;
  u.phone = $('euPhone').value.trim();
  u.location = $('euLocation').value.trim();
  u.joined = $('euJoined').value;
  u.status = $('euStatus').value;
  u.accType = $('euAccType').value;
  u.bio = $('euBio').value.trim();
  u.stats.posts = parseInt($('euPosts').value)||0;
  u.stats.followers = parseInt($('euFollowers').value)||0;
  u.stats.following = parseInt($('euFollowing').value)||0;
  u.stats.likes = parseInt($('euLikes').value)||0;
  u.stats.comments = parseInt($('euComments').value)||0;
  u.stats.shares = parseInt($('euShares').value)||0;
  u.stats.views = parseInt($('euViews').value)||0;
  u.stats.saves = parseInt($('euSaves').value)||0;
  u.stats.stories = parseInt($('euStories').value)||0;
  u.stats.live = parseInt($('euLive').value)||0;
  if (!u.social) u.social = {};
  u.social.facebook = $('euFacebook').value.trim();
  u.social.instagram = $('euInstagram').value.trim();
  u.social.twitter = $('euTwitter').value.trim();
  u.social.youtube = $('euYoutube').value.trim();
  lsSet('ev_users', users);
  renderUsers();
  renderRecentUsers();
  renderDashboard();
  closeModal('editUserModal');
  toast('✅ User updated!', 'success');
};

// ─── MESSAGES ──────────────────────────────────────────────────────────────
function renderMessages() {
  const list = $('msgList');
  list.innerHTML = msgs.map(m => `
    <div class="msg-item" onclick="openChat(${m.id})">
      <div class="mi-pic">${initials(m.from)}</div>
      <div class="mi-info"><div class="mi-name">${esc(m.from)}</div><div class="mi-preview">${esc(m.preview)}</div></div>
      <div class="mi-time">${m.time}</div>
    </div>
  `).join('');
}

window.openChat = function(id) {
  const m = msgs.find(x => x.id === id);
  if (!m) return;
  $('msgChat').innerHTML = `
    <div style="padding:16px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px">
      <div class="mi-pic">${initials(m.from)}</div>
      <div><div style="font-weight:700">${esc(m.from)}</div><div style="font-size:0.78rem;color:var(--text3)">Online</div></div>
    </div>
    <div style="flex:1;padding:20px;overflow-y:auto">
      <div style="background:var(--surf2);border-radius:12px 12px 12px 0;padding:12px 16px;max-width:75%;font-size:0.88rem;color:var(--text2);line-height:1.5">${esc(m.preview)}</div>
    </div>
    <div style="padding:12px 16px;border-top:1px solid var(--border);display:flex;gap:10px">
      <input placeholder="Type a message…" style="flex:1;background:var(--surf2);border:1px solid var(--border);border-radius:9px;color:var(--text);padding:10px 14px;font-family:'Rajdhani',sans-serif;font-size:0.9rem;outline:none"/>
      <button class="btn-red" style="padding:10px 18px"><i class="fas fa-paper-plane"></i></button>
    </div>
  `;
  document.querySelectorAll('.msg-item').forEach(el => el.classList.remove('active'));
};

// ─── NOTIFICATIONS ─────────────────────────────────────────────────────────
function renderNotifications() {
  const list = $('notifList');
  if (!notifs.length) {
    list.innerHTML = `<div class="empty-state"><i class="fas fa-bell"></i><p>No notifications.</p></div>`;
    return;
  }
  list.innerHTML = notifs.map(n => `
    <div class="notif-item ${n.unread?'unread':''}">
      <div class="ni-icon"><i class="${n.icon}"></i></div>
      <div class="ni-body">
        <div class="ni-title">${esc(n.title)}</div>
        <div class="ni-msg">${esc(n.msg)}</div>
        <div class="ni-time">${n.time}</div>
      </div>
    </div>
  `).join('');
  updateNotifBadge();
}

function updateNotifBadge() {
  const cnt = notifs.filter(n=>n.unread).length;
  const badge = $('notifBadge');
  if (badge) badge.textContent = cnt || '';
  if (badge) badge.style.display = cnt ? '' : 'none';
}

window.clearNotifs = function() {
  notifs = notifs.map(n => ({...n, unread:false}));
  lsSet('ev_notifs', notifs);
  renderNotifications();
  toast('✅ Notifications cleared', 'success');
};

// ─── FOUNDER PROFILE PAGE ──────────────────────────────────────────────────
function renderFounderProfilePage() {
  const f = founder;
  // cover
  const coverEl = $('founderCoverArea');
  if (f.coverPic) { coverEl.style.backgroundImage=`url(${f.coverPic})`;coverEl.style.backgroundSize='cover';coverEl.style.backgroundPosition='center'; }
  else { coverEl.style.backgroundImage=''; }
  // pic
  $('founderBigPic').src = f.profilePic || makeAvatar(f.name, 110);
  $('fpName').textContent = f.name;
  $('fpEmail').innerHTML = `<i class="fas fa-envelope"></i> ${esc(f.email)}`;
  $('fpJoined').innerHTML = `<i class="fas fa-calendar-alt"></i> Joined ${fmtDate(f.joined)}`;
  const dot = $('fpStatusDot');
  dot.className = 'sdot large ' + (f.status !== 'active' ? f.status : '');
  $('fpStatusTxt').textContent = cap(f.status);

  // stats bar
  const s = f.stats;
  const statBar = $('profileStatsBar');
  const items = [
    {val:s.posts, lbl:'Posts'},
    {val:s.followers, lbl:'Followers'},
    {val:s.following, lbl:'Following'},
    {val:s.likes, lbl:'Likes'},
    {val:s.views, lbl:'Views'},
    {val:s.comments, lbl:'Comments'},
  ];
  statBar.innerHTML = items.map(i=>`<div class="psb-item"><div class="psb-val">${fmtNum(i.val)}</div><div class="psb-lbl">${i.lbl}</div></div>`).join('');

  // details grid
  const dg = $('profileDetailsGrid');
  const details = [
    {label:'Username', val:f.username||'—'},
    {label:'Phone', val:f.phone||'—'},
    {label:'Location', val:f.location||'—'},
    {label:'Website', val:f.website||'—'},
    {label:'Date of Birth', val:fmtDate(f.dob)},
    {label:'Account Type', val:cap(f.accType||'founder')},
    {label:'Visibility', val:cap(f.visibility||'public')},
    {label:'Stories', val:fmtNum(s.stories)},
    {label:'Live Sessions', val:fmtNum(s.live)},
    {label:'Saves', val:fmtNum(s.saves)},
  ];
  if (f.bio) details.unshift({label:'Bio', val:f.bio});
  dg.innerHTML = details.map(d=>`<div class="pdg-item"><div class="pdg-label">${d.label}</div><div class="pdg-value">${esc(String(d.val))}</div></div>`).join('');

  // social links
  const sl = $('profileSocialLinks');
  const icons = {facebook:{icon:'fab fa-facebook',color:'#1877f2'},instagram:{icon:'fab fa-instagram',color:'#e1306c'},twitter:{icon:'fab fa-twitter',color:'#1da1f2'},youtube:{icon:'fab fa-youtube',color:'#ff0000'},linkedin:{icon:'fab fa-linkedin',color:'#0a66c2'},tiktok:{icon:'fab fa-tiktok',color:'#fff'},github:{icon:'fab fa-github',color:'#aaa'},telegram:{icon:'fab fa-telegram',color:'#229ed9'}};
  const links = f.social ? Object.entries(f.social).filter(([k,v])=>v).map(([k,v])=>`<a class="social-link-pill" href="${esc(v)}" target="_blank"><i class="${icons[k]?.icon||'fas fa-link'}" style="color:${icons[k]?.color||'var(--red)'}"></i>${cap(k)}</a>`).join('') : '';
  sl.innerHTML = links || '<span style="font-size:0.82rem;color:var(--text3)">No social links added yet.</span>';
}

// ─── SETTINGS ──────────────────────────────────────────────────────────────
function fillSettings() {
  const f = founder;
  $('sName').value = f.name||'';
  $('sUsername').value = f.username||'';
  $('sEmail').value = f.email||'';
  $('sPhone').value = f.phone||'';
  $('sLocation').value = f.location||'';
  $('sWebsite').value = f.website||'';
  $('sDob').value = f.dob||'';
  $('sJoined').value = f.joined||'';
  $('sBio').value = f.bio||'';
  $('sPosts').value = f.stats.posts||0;
  $('sFollowers').value = f.stats.followers||0;
  $('sFollowing').value = f.stats.following||0;
  $('sLikes').value = f.stats.likes||0;
  $('sComments').value = f.stats.comments||0;
  $('sShares').value = f.stats.shares||0;
  $('sViews').value = f.stats.views||0;
  $('sSaves').value = f.stats.saves||0;
  $('sStories').value = f.stats.stories||0;
  $('sLive').value = f.stats.live||0;
  const so = f.social||{};
  ['facebook','instagram','twitter','youtube','linkedin','tiktok','github','telegram'].forEach(k=>{ const el=$('s'+cap(k)); if(el) el.value=so[k]||''; });
  $('sDarkMode').checked = !!f.darkMode;
  $('sCompact').checked = !!f.compact;
  $('sStatus').value = f.status||'active';
  $('sVisibility').value = f.visibility||'public';
  $('sAccType').value = f.accType||'founder';
  $('sShowFollowers').checked = f.showFollowers !== false;
  $('sAllowMsg').checked = f.allowMsg !== false;
  $('sShowStatus').checked = f.showStatus !== false;
  // pic previews
  $('settingsPicPreview').src = f.profilePic || makeAvatar(f.name, 64);
  const cp = $('settingsCoverPreview');
  if (f.coverPic) { cp.src = f.coverPic; cp.style.display='block'; }
  // color swatches
  buildColorSwatches();
}

function buildColorSwatches() {
  const colors = ['#ff0000','#ff6600','#ff0066','#cc00ff','#0066ff','#00aaff','#00cc88','#ffcc00'];
  $('colorSwatches').innerHTML = colors.map(c=>`<div class="color-swatch${c===founder.accentColor?' selected':''}" style="background:${c}" onclick="setAccent('${c}')"></div>`).join('');
}

window.setAccent = function(c) {
  founder.accentColor = c;
  document.documentElement.style.setProperty('--red', c);
  buildColorSwatches();
};

window.saveAllSettings = function() {
  founder.name = $('sName').value.trim() || founder.name;
  founder.username = $('sUsername').value.trim();
  founder.email = $('sEmail').value.trim();
  founder.phone = $('sPhone').value.trim();
  founder.location = $('sLocation').value.trim();
  founder.website = $('sWebsite').value.trim();
  founder.dob = $('sDob').value;
  founder.joined = $('sJoined').value;
  founder.bio = $('sBio').value.trim();
  founder.stats.posts = parseInt($('sPosts').value)||0;
  founder.stats.followers = parseInt($('sFollowers').value)||0;
  founder.stats.following = parseInt($('sFollowing').value)||0;
  founder.stats.likes = parseInt($('sLikes').value)||0;
  founder.stats.comments = parseInt($('sComments').value)||0;
  founder.stats.shares = parseInt($('sShares').value)||0;
  founder.stats.views = parseInt($('sViews').value)||0;
  founder.stats.saves = parseInt($('sSaves').value)||0;
  founder.stats.stories = parseInt($('sStories').value)||0;
  founder.stats.live = parseInt($('sLive').value)||0;
  if (!founder.social) founder.social = {};
  ['facebook','instagram','twitter','youtube','linkedin','tiktok','github','telegram'].forEach(k=>{ const el=$('s'+cap(k)); if(el) founder.social[k]=el.value.trim(); });
  founder.darkMode = $('sDarkMode').checked;
  founder.compact = $('sCompact').checked;
  founder.status = $('sStatus').value;
  founder.visibility = $('sVisibility').value;
  founder.accType = $('sAccType').value;
  founder.showFollowers = $('sShowFollowers').checked;
  founder.allowMsg = $('sAllowMsg').checked;
  founder.showStatus = $('sShowStatus').checked;
  lsSet('ev_founder', founder);
  applyTheme(founder.darkMode);
  renderSidebarFounder();
  renderTopbarAvatar();
  renderDashboard();
  renderAnalytics();
  renderFounderProfilePage();
  toast('✅ All settings saved!', 'success');
};

window.resetSettings = function() {
  confirm2('Reset Settings?', 'This will restore default founder settings.', () => {
    founder = { ...FOUNDER_DEFAULT };
    lsSet('ev_founder', founder);
    fillSettings();
    applyTheme(founder.darkMode);
    renderSidebarFounder();
    renderTopbarAvatar();
    renderDashboard();
    toast('🔄 Settings reset to default', 'info');
  });
};
window.clearAllUsers = function() {
  confirm2('Clear All Users?', 'This will permanently delete all user accounts.', () => {
    users = [];
    lsSet('ev_users', users);
    renderUsers();
    renderRecentUsers();
    renderDashboard();
    renderAnalytics();
    toast('🗑 All users cleared', 'error');
  });
};
window.exportAll = function() {
  const data = { founder, users, posts, notifs, exportedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'everest-dashboard-data.json';
  a.click();
  toast('📥 Data exported!', 'success');
};
window.exportProfile = window.exportAll;
window.copyProfileLink = function() {
  navigator.clipboard?.writeText(window.location.href).then(()=>toast('🔗 Link copied!','success')).catch(()=>toast('⚠️ Copy failed','error'));
};

// ─── SETTINGS TABS ─────────────────────────────────────────────────────────
function setupSettingsTabs() {
  $('settingsTabs').addEventListener('click', e => {
    const btn = e.target.closest('.stab');
    if (!btn) return;
    document.querySelectorAll('.stab').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.settings-tab-panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    $('stab-' + btn.dataset.tab)?.classList.add('active');
  });
}

// ─── IMAGE UPLOADS ─────────────────────────────────────────────────────────
function setupImageUploads() {
  // Founder profile pic
  $('founderPicInput').addEventListener('change', e => {
    readImg(e.target.files[0], src => {
      founder.profilePic = src;
      lsSet('ev_founder', founder);
      $('founderBigPic').src = src;
      renderSidebarFounder();
      renderTopbarAvatar();
      $('settingsPicPreview').src = src;
      toast('📸 Profile photo updated!', 'success');
    });
  });
  // Founder cover
  $('founderCoverInput').addEventListener('change', e => {
    readImg(e.target.files[0], src => {
      founder.coverPic = src;
      lsSet('ev_founder', founder);
      renderFounderProfilePage();
      renderSidebarFounder();
      toast('🖼 Cover updated!', 'success');
    });
  });
  // Settings profile pic
  $('settingsProfilePic').addEventListener('change', e => {
    readImg(e.target.files[0], src => {
      founder.profilePic = src;
      lsSet('ev_founder', founder);
      $('settingsPicPreview').src = src;
      renderSidebarFounder();
      renderTopbarAvatar();
      toast('📸 Profile photo updated!', 'success');
    });
  });
  // Settings cover
  $('settingsCoverPic').addEventListener('change', e => {
    readImg(e.target.files[0], src => {
      founder.coverPic = src;
      lsSet('ev_founder', founder);
      const cp = $('settingsCoverPreview');
      cp.src = src; cp.style.display='block';
      renderFounderProfilePage();
      toast('🖼 Cover updated!', 'success');
    });
  });
  // Add user pic
  $('newUserPicInput').addEventListener('change', e => {
    readImg(e.target.files[0], src => {
      newUserPicData = src;
      $('newUserPicPreview').src = src;
    });
  });
  // Add user cover
  $('newUserCoverInput').addEventListener('change', e => {
    readImg(e.target.files[0], src => {
      newUserCoverData = src;
      $('newUserCoverPreview').style.backgroundImage = `url(${src})`;
      $('newUserCoverPreview').style.backgroundSize = 'cover';
    });
  });
}

// ─── NAVIGATION ─────────────────────────────────────────────────────────────
function setupNav() {
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      openPage(item.dataset.page);
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('sidebarOverlay').classList.remove('show');
    });
  });
}

window.openPage = function(page) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navItem) navItem.classList.add('active');
  const pageEl = $('page-' + page);
  if (pageEl) pageEl.classList.add('active');
  if (page === 'founder-profile') renderFounderProfilePage();
  if (page === 'users') renderUsers();
  if (page === 'notifications') { notifs = notifs.map(n=>({...n,unread:false})); lsSet('ev_notifs',notifs); updateNotifBadge(); }
  window.scrollTo(0,0);
};

// ─── SEARCH ────────────────────────────────────────────────────────────────
function setupSearch() {
  const input = $('globalSearch');
  const drop = $('searchDropdown');

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { drop.style.display='none'; return; }

    const allPeople = [
      { id:'FOUNDER', name:founder.name, username:founder.username||'@simanto', email:founder.email, isFounder:true, pic:founder.profilePic },
      ...users.map(u => ({ id:u.id, name:u.name, username:u.username||'', email:u.email, isFounder:false, pic:u.profilePic }))
    ];
    const matches = allPeople.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.username||'').toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q)
    );

    if (!matches.length) {
      drop.style.display='block';
      drop.innerHTML = `<div class="search-no-result"><i class="fas fa-search" style="color:var(--red);opacity:0.3;display:block;font-size:1.5rem;margin-bottom:8px"></i>No results for "${esc(input.value)}"</div>`;
      return;
    }
    drop.innerHTML = matches.map(p => {
      const picHTML = p.pic ? `<img src="${p.pic}" class="si-pic" style="display:block">` : `<div class="si-pic">${initials(p.name)}</div>`;
      return `<div class="search-item" onclick="handleSearch('${p.id}','${p.isFounder}')">
        ${picHTML}
        <div class="si-info">
          <div class="si-name">${esc(p.name)}</div>
          <div class="si-id">${p.id} · ${esc(p.username)}</div>
        </div>
        ${p.isFounder ? '<span class="si-badge">⛰ Founder</span>' : ''}
      </div>`;
    }).join('');
    drop.style.display = 'block';
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.top-search')) { drop.style.display='none'; input.value=''; }
  });
  // Keyboard shortcut
  document.addEventListener('keydown', e => { if ((e.ctrlKey||e.metaKey)&&e.key==='k') { e.preventDefault(); input.focus(); }});
}

window.handleSearch = function(id, isFounder) {
  $('searchDropdown').style.display = 'none';
  $('globalSearch').value = '';
  if (isFounder === 'true' || isFounder === true) {
    openPage('founder-profile');
  } else {
    openPage('users');
    setTimeout(() => openUserDetail(id), 200);
  }
};

// ─── MODALS ────────────────────────────────────────────────────────────────
function setupModals() {
  document.querySelectorAll('.modal-bg').forEach(bg => {
    bg.addEventListener('click', e => { if(e.target===bg) closeModal(bg.id); });
  });
}
function openModal(id) { $(id)?.classList.add('open'); document.body.style.overflow='hidden'; }
function closeModal(id) { $(id)?.classList.remove('open'); document.body.style.overflow=''; }
window.closeModal = closeModal;

let confirmCallback = null;
function confirm2(title, msg, cb) {
  $('confirmTitle').textContent = title;
  $('confirmMsg').textContent = msg;
  confirmCallback = cb;
  openModal('confirmModal');
  $('confirmOkBtn').onclick = () => { closeModal('confirmModal'); if(confirmCallback) confirmCallback(); };
}

// ─── HAMBURGER ─────────────────────────────────────────────────────────────
function setupHamburger() {
  $('hamburger').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('show');
  });
  $('sidebarOverlay').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('show');
  });
}

// ─── CHARTS (vanilla canvas) ───────────────────────────────────────────────
function buildCharts() {
  // Load Chart.js from CDN
  if (window.Chart) { drawCharts(); return; }
  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
  s.onload = drawCharts;
  document.head.appendChild(s);
}

function drawCharts() {
  const red = '#ff0000';
  const red2 = 'rgba(255,0,0,0.12)';
  const textColor = founder.darkMode ? '#a0a0c0' : '#444466';
  const gridColor = founder.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  Chart.defaults.color = textColor;
  Chart.defaults.borderColor = gridColor;

  const months7 = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const months30 = Array.from({length:30},(_,i)=>i+1+'');
  const months12 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // Growth chart
  const gctx = $('growthChart')?.getContext('2d');
  if (gctx) {
    growthChart = new Chart(gctx, {
      type:'line',
      data:{
        labels: months30,
        datasets:[
          {label:'Followers',data:Array.from({length:30},(_,i)=>Math.round(14000+Math.random()*300+i*60)),borderColor:red,backgroundColor:red2,tension:0.4,fill:true,pointRadius:0,borderWidth:2},
          {label:'Views',data:Array.from({length:30},(_,i)=>Math.round(10000+Math.random()*2000+i*400)),borderColor:'#3b82f6',backgroundColor:'rgba(59,130,246,0.08)',tension:0.4,fill:true,pointRadius:0,borderWidth:2},
        ]
      },
      options:{responsive:true,plugins:{legend:{position:'top',labels:{boxWidth:12,font:{family:'Rajdhani',size:12}}}},scales:{x:{grid:{display:false},ticks:{maxTicksLimit:10,font:{family:'Rajdhani'}}},y:{grid:{color:gridColor},ticks:{font:{family:'Rajdhani'}}}}}
    });
  }

  // Engagement doughnut
  const ectx = $('engagementChart')?.getContext('2d');
  if (ectx) {
    const s = founder.stats;
    engagementChart = new Chart(ectx, {
      type:'doughnut',
      data:{
        labels:['Likes','Comments','Shares','Saves'],
        datasets:[{data:[s.likes, s.comments, s.shares, s.saves],backgroundColor:['#ff0000','#ff6600','#ffcc00','#3b82f6'],borderWidth:0,hoverOffset:6}]
      },
      options:{responsive:true,cutout:'70%',plugins:{legend:{position:'bottom',labels:{boxWidth:10,padding:12,font:{family:'Rajdhani'}}}}}
    });
  }

  // Monthly activity
  const mctx = $('monthlyChart')?.getContext('2d');
  if (mctx) {
    monthlyChart = new Chart(mctx, {
      type:'bar',
      data:{
        labels:months12,
        datasets:[
          {label:'Posts',data:[14,19,12,28,22,34,41,38,29,47,52,61],backgroundColor:red2,borderColor:red,borderWidth:2,borderRadius:6},
          {label:'Users',data:[3,5,2,8,6,11,14,12,9,16,18,22],backgroundColor:'rgba(59,130,246,0.2)',borderColor:'#3b82f6',borderWidth:2,borderRadius:6},
        ]
      },
      options:{responsive:true,plugins:{legend:{position:'top',labels:{boxWidth:12,font:{family:'Rajdhani',size:12}}}},scales:{x:{grid:{display:false},ticks:{font:{family:'Rajdhani'}}},y:{grid:{color:gridColor},ticks:{font:{family:'Rajdhani'}}}}}
    });
  }

  // Status pie
  const spctx = $('statusPieChart')?.getContext('2d');
  if (spctx) {
    const counts = {active:0,away:0,busy:0,offline:0};
    users.forEach(u => counts[u.status] = (counts[u.status]||0)+1);
    statusPieChart = new Chart(spctx, {
      type:'pie',
      data:{
        labels:['Active','Away','Busy','Offline'],
        datasets:[{data:[counts.active,counts.away,counts.busy,counts.offline],backgroundColor:['#22c55e','#eab308','#ff0000','#6b7280'],borderWidth:0,hoverOffset:6}]
      },
      options:{responsive:true,plugins:{legend:{position:'bottom',labels:{boxWidth:10,padding:12,font:{family:'Rajdhani'}}}}}
    });
  }
}

// ─── TOAST ─────────────────────────────────────────────────────────────────
function toast(msg, type='success') {
  const icons = {success:'fas fa-check-circle',error:'fas fa-times-circle',info:'fas fa-info-circle'};
  const div = document.createElement('div');
  div.className = `toast ${type}`;
  div.innerHTML = `<i class="${icons[type]||icons.success}" style="color:var(--red)"></i>${esc(msg)}`;
  $('toastContainer').appendChild(div);
  setTimeout(() => { div.style.animation='toastOut .3s ease forwards'; setTimeout(()=>div.remove(),300); }, 3000);
}
window.toast = toast;

// ─── HELPERS ───────────────────────────────────────────────────────────────
function makeAvatar(name, size) {
  const inits = (name||'EA').split(' ').map(n=>n[0]||'').join('').slice(0,2).toUpperCase();
  const s = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="#1a0000" rx="${size/2}"/><text x="50%" y="62%" font-size="${Math.round(size*0.38)}" font-family="Georgia" font-weight="bold" fill="#ff0000" text-anchor="middle" dominant-baseline="middle">${inits}</text></svg>`;
  return 'data:image/svg+xml;base64,' + btoa(s);
}
function initials(name) { return (name||'').split(' ').map(n=>n[0]||'').join('').slice(0,2).toUpperCase(); }
function readImg(file, cb) { if(!file)return; const r=new FileReader(); r.onload=e=>cb(e.target.result); r.readAsDataURL(file); }
function fmtNum(n) { if(!n&&n!==0)return'0'; if(n>=1e6)return(n/1e6).toFixed(1)+'M'; if(n>=1000)return(n/1000).toFixed(1)+'K'; return String(n); }
function fmtDate(d) { if(!d)return'—'; try{return new Date(d).toLocaleDateString('en-BD',{year:'numeric',month:'long',day:'numeric'})}catch{return d} }
function cap(s) { return s?(s[0].toUpperCase()+s.slice(1)):'' }
function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') }