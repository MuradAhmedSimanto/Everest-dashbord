// ========================================
// EVEREST DASHBOARD - INITIALIZATION
// ========================================

function seedDemoData() {
  // Only seed if no users exist
  if (EverestDB.get('users', []).length > 0) return;

  const demoUsers = [
    { id: genId(), name: 'Rahim Uddin', email: 'rahim@everest.com', username: 'rahim_ud', role: 'Admin', status: 'active', followers: 1240, following: 320, posts: 45, location: 'Dhaka, BD', bio: 'Platform Admin', verified: true, joined: Date.now() - 120*86400000, avatar: '', cover: '' },
    { id: genId(), name: 'Sadia Islam', email: 'sadia@everest.com', username: 'sadia_i', role: 'Moderator', status: 'active', followers: 890, following: 210, posts: 32, location: 'Chittagong, BD', bio: 'Content Moderator', verified: true, joined: Date.now() - 90*86400000, avatar: '', cover: '' },
    { id: genId(), name: 'Karim Hossain', email: 'karim@everest.com', username: 'karim_h', role: 'User', status: 'active', followers: 560, following: 180, posts: 18, location: 'Sylhet, BD', bio: 'Tech Enthusiast', verified: false, joined: Date.now() - 60*86400000, avatar: '', cover: '' },
    { id: genId(), name: 'Nasrin Akter', email: 'nasrin@everest.com', username: 'nasrin_a', role: 'Verified', status: 'active', followers: 3200, following: 450, posts: 76, location: 'Rajshahi, BD', bio: 'Digital Creator', verified: true, joined: Date.now() - 45*86400000, avatar: '', cover: '' },
    { id: genId(), name: 'Tanvir Ahmed', email: 'tanvir@everest.com', username: 'tanvir_a', role: 'User', status: 'pending', followers: 120, following: 85, posts: 5, location: 'Khulna, BD', bio: 'New member', verified: false, joined: Date.now() - 10*86400000, avatar: '', cover: '' },
    { id: genId(), name: 'Mitu Begum', email: 'mitu@everest.com', username: 'mitu_b', role: 'User', status: 'banned', followers: 45, following: 30, posts: 2, location: 'Comilla, BD', bio: '', verified: false, joined: Date.now() - 5*86400000, avatar: '', cover: '' },
  ];
  EverestDB.set('users', demoUsers);

  const demoPosts = [
    { id: genId(), userId: demoUsers[0].id, author: demoUsers[0].name, text: 'Welcome to Everest! 🏔️ The ultimate social platform from Bangladesh. We are thrilled to launch this amazing community.', type: 'text', likes: 245, comments: 38, shares: 12, time: Date.now() - 2*86400000 },
    { id: genId(), userId: demoUsers[3].id, author: demoUsers[3].name, text: 'Just posted my new digital art collection! Been working on this for months. Check it out and let me know what you think 🎨✨', type: 'image', likes: 1203, comments: 89, shares: 45, time: Date.now() - 86400000 },
    { id: genId(), userId: demoUsers[2].id, author: demoUsers[2].name, text: 'Everest is growing so fast! Proud to be an early member of this amazing platform. The future of social media is here 🚀', type: 'text', likes: 67, comments: 12, shares: 5, time: Date.now() - 3600000 },
    { id: genId(), userId: demoUsers[1].id, author: demoUsers[1].name, text: 'Community guidelines reminder: Please be respectful to all members. Together we can build a positive space for everyone.', type: 'text', likes: 342, comments: 15, shares: 28, time: Date.now() - 1800000 },
  ];
  EverestDB.set('posts', demoPosts);

  const demoTickets = [
    { id: genId(), title: 'Cannot upload profile picture', body: 'I have been trying to upload my profile picture but it keeps failing. I have tried multiple formats (JPG, PNG) and different sizes but nothing works.', userId: demoUsers[2].id, userName: demoUsers[2].name, priority: 'medium', status: 'open', created: Date.now() - 2*86400000 },
    { id: genId(), title: 'Account suspension appeal', body: 'My account was suspended but I believe it was a mistake. I did not violate any community guidelines. Please review my account.', userId: demoUsers[5].id, userName: demoUsers[5].name, priority: 'high', status: 'in-progress', created: Date.now() - 86400000 },
    { id: genId(), title: 'Feature request: Dark mode toggle', body: 'It would be great to have a toggle for dark/light mode directly in the profile settings for easier access.', userId: demoUsers[4].id, userName: demoUsers[4].name, priority: 'low', status: 'closed', created: Date.now() - 5*86400000 },
  ];
  EverestDB.set('tickets', demoTickets);

  const demoAnnouncements = [
    { id: genId(), title: 'Welcome to Everest Social Platform!', body: 'We are thrilled to announce the official launch of Everest — Bangladesh\'s premier social media platform. Join millions of users and start sharing your story today!', type: 'feature', author: 'Murad Ahmed Simanto', pinned: true, time: Date.now() - 7*86400000 },
    { id: genId(), title: 'Scheduled Maintenance — Sunday 2AM-4AM', body: 'We will be performing scheduled maintenance this Sunday from 2:00 AM to 4:00 AM BST. The platform may be temporarily unavailable during this period.', type: 'maintenance', author: 'Murad Ahmed Simanto', pinned: false, time: Date.now() - 2*86400000 },
    { id: genId(), title: 'New Feature: Verified Badges Now Available', body: 'Public figures, creators, and businesses can now apply for verification badges. Visit your profile settings to submit a verification request.', type: 'update', author: 'Murad Ahmed Simanto', pinned: false, time: Date.now() - 86400000 },
  ];
  EverestDB.set('announcements', demoAnnouncements);

  const demoReports = [
    { id: genId(), title: 'Spam messages in comments', description: 'User is posting repeated promotional spam links in multiple post comments.', type: 'spam', priority: 'medium', reporterId: demoUsers[0].id, reporterName: demoUsers[0].name, targetId: demoUsers[5].id, targetName: demoUsers[5].name, status: 'pending', time: Date.now() - 86400000 },
    { id: genId(), title: 'Harassment in direct messages', description: 'Receiving harassing messages with inappropriate content. This needs immediate attention.', type: 'harassment', priority: 'high', reporterId: demoUsers[3].id, reporterName: demoUsers[3].name, targetId: demoUsers[4].id, targetName: demoUsers[4].name, status: 'investigating', time: Date.now() - 3600000 },
  ];
  EverestDB.set('reports', demoReports);

  const demoFeedback = [
    { id: genId(), name: 'Karim H.', category: 'General', text: 'The platform is amazing! Clean UI and very fast. Really enjoying the Everest experience.', rating: 5, time: Date.now() - 3*86400000 },
    { id: genId(), name: 'Nasrin A.', category: 'Feature Request', text: 'Would love to see stories feature like Instagram. Otherwise great platform!', rating: 4, time: Date.now() - 86400000 },
    { id: genId(), name: 'Anonymous', category: 'Bug Report', text: 'Sometimes the notifications take a while to load. Minor issue but could be improved.', rating: 3, time: Date.now() - 3600000 },
  ];
  EverestDB.set('feedback', demoFeedback);

  const demoContent = [
    { id: genId(), title: 'Everest Banner 2025', type: 'image', description: 'Official platform banner for social media', thumbnail: '', views: 342, time: Date.now() - 5*86400000 },
    { id: genId(), title: 'Platform Launch Video', type: 'video', description: 'Official launch announcement video', thumbnail: '', views: 1205, time: Date.now() - 3*86400000 },
    { id: genId(), title: 'Community Guidelines PDF', type: 'document', description: 'Complete community guidelines document', thumbnail: '', views: 890, time: Date.now() - 2*86400000 },
  ];
  EverestDB.set('content', demoContent);

  const demoVerification = [
    { id: genId(), userId: demoUsers[2].id, userName: demoUsers[2].name, type: 'Individual', reason: 'Popular tech blogger with 10K+ subscribers', status: 'pending', time: Date.now() - 86400000 },
    { id: genId(), userId: demoUsers[4].id, userName: demoUsers[4].name, type: 'Creator', reason: 'Content creator with growing audience', status: 'pending', time: Date.now() - 3600000 },
  ];
  EverestDB.set('verification_requests', demoVerification);

  // Demo activity log
  const demoLogs = [
    { id: genId(), text: 'Platform launched successfully', type: 'success', user: 'Murad Ahmed Simanto', time: Date.now() - 7*86400000 },
    { id: genId(), text: 'New user registered: Rahim Uddin', type: 'info', user: 'System', time: Date.now() - 6*86400000 },
    { id: genId(), text: 'Admin role assigned to Rahim Uddin', type: 'success', user: 'Murad Ahmed Simanto', time: Date.now() - 5*86400000 },
    { id: genId(), text: 'Announcement published: Welcome to Everest!', type: 'info', user: 'Murad Ahmed Simanto', time: Date.now() - 4*86400000 },
    { id: genId(), text: 'User banned: Mitu Begum', type: 'warn', user: 'Rahim Uddin', time: Date.now() - 2*86400000 },
    { id: genId(), text: 'Support ticket opened by Karim Hossain', type: 'info', user: 'System', time: Date.now() - 86400000 },
  ];
  EverestDB.set('activity_log', demoLogs);

  // Demo notifications
  const demoNotifs = [
    { id: genId(), msg: 'New user "Tanvir Ahmed" joined Everest', icon: 'fa-user-plus', time: Date.now() - 3600000 },
    { id: genId(), msg: 'New support ticket: Cannot upload profile picture', icon: 'fa-headset', time: Date.now() - 2*3600000 },
    { id: genId(), msg: 'Verification request from Karim Hossain', icon: 'fa-check-circle', time: Date.now() - 5*3600000 },
  ];
  EverestDB.set('notifications', demoNotifs);
  EverestDB.set('notif_unread', 3);
}

// ========================================
// APP BOOT
// ========================================
document.addEventListener('DOMContentLoaded', function () {
  // Seed demo data on first run
  seedDemoData();

  // Load founder images
  refreshFounderUI();

  // Render notification badge
  renderNotifBadge();

  // Navigate to overview
  navigateTo('overview');

  // Keyboard shortcut: Ctrl+K for search
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('globalSearch').focus();
    }
    if (e.key === 'Escape') {
      closeModal();
      document.getElementById('notifDropdown').classList.remove('show');
      document.getElementById('searchResults').classList.remove('show');
    }
  });

  console.log('%c🏔️ EVEREST DASHBOARD', 'color:#ff0000;font-size:20px;font-weight:bold;font-family:sans-serif;');
  console.log('%cFounded by Murad Ahmed Simanto', 'color:#888;font-size:12px;');
});