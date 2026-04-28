// ========================================
// EVEREST DASHBOARD - LOCAL STORAGE LAYER
// ========================================

const EverestDB = {
  get(key, def = null) {
    try {
      const raw = localStorage.getItem('everest_' + key);
      return raw !== null ? JSON.parse(raw) : def;
    } catch { return def; }
  },
  set(key, val) {
    try { localStorage.setItem('everest_' + key, JSON.stringify(val)); return true; }
    catch { return false; }
  },
  remove(key) { localStorage.removeItem('everest_' + key); },
  update(key, fn, def = {}) {
    const cur = this.get(key, def);
    const next = fn(cur);
    this.set(key, next);
    return next;
  }
};

// Generate ID
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Format date
function fmtDate(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}
function fmtDateTime(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  return d.toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
}
function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h ago';
  const dy = Math.floor(h / 24);
  return dy + 'd ago';
}