function renderFeedback() {
  const feedbacks = EverestDB.get('feedback', []);
  const avg = feedbacks.length ? (feedbacks.reduce((s,f)=>s+(f.rating||0),0)/feedbacks.length).toFixed(1) : '0.0';

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header"><h1><i class="fas fa-comments"></i> Feedback</h1><p>${feedbacks.length} feedback(s) received</p></div>

    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:16px;">
      <div class="stat-card"><div class="stat-icon"><i class="fas fa-star"></i></div><div class="stat-value">${avg}</div><div class="stat-label">Avg Rating</div></div>
      <div class="stat-card"><div class="stat-icon"><i class="fas fa-comments"></i></div><div class="stat-value">${feedbacks.length}</div><div class="stat-label">Total</div></div>
      <div class="stat-card"><div class="stat-icon"><i class="fas fa-smile"></i></div><div class="stat-value">${feedbacks.filter(f=>f.rating>=4).length}</div><div class="stat-label">Positive (4-5★)</div></div>
      <div class="stat-card"><div class="stat-icon"><i class="fas fa-meh"></i></div><div class="stat-value">${feedbacks.filter(f=>f.rating<=2).length}</div><div class="stat-label">Negative (1-2★)</div></div>
    </div>

    <div class="grid-2">
      <div>
        <div class="filter-row" style="margin-bottom:12px;">
          <select class="form-control" style="max-width:160px;" onchange="filterFeedback(this.value)">
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option><option value="4">4 Stars</option>
            <option value="3">3 Stars</option><option value="2">2 Stars</option><option value="1">1 Star</option>
          </select>
          <button class="btn btn-danger btn-sm" onclick="clearAllFeedback()"><i class="fas fa-trash"></i> Clear All</button>
        </div>
        <div id="feedbackList">
          ${renderFeedbackList(feedbacks)}
        </div>
      </div>
      <div class="card">
        <div class="card-title"><i class="fas fa-pen"></i> Submit Feedback</div>
        <div class="form-group">
          <label class="form-label">Your Name</label>
          <input class="form-control" id="fb_name" placeholder="Name (optional)"/>
        </div>
        <div class="form-group">
          <label class="form-label">Rating</label>
          <div class="star-rating" id="starRating">
            <span data-v="1" onclick="setRating(1)">★</span>
            <span data-v="2" onclick="setRating(2)">★</span>
            <span data-v="3" onclick="setRating(3)">★</span>
            <span data-v="4" onclick="setRating(4)">★</span>
            <span data-v="5" onclick="setRating(5)">★</span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Category</label>
          <select class="form-control" id="fb_cat">
            <option>General</option><option>Bug Report</option><option>Feature Request</option><option>Performance</option><option>Design</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Message</label>
          <textarea class="form-control" id="fb_text" placeholder="Share your feedback..."></textarea>
        </div>
        <button class="btn btn-primary" onclick="submitFeedback()"><i class="fas fa-paper-plane"></i> Submit Feedback</button>
      </div>
    </div>
  `;
  window._currentRating = 0;
}

function renderFeedbackList(feedbacks) {
  if (!feedbacks.length) return '<div class="empty-state"><i class="fas fa-comment-slash"></i><p>No feedback yet</p></div>';
  return feedbacks.slice().reverse().map(f => `
    <div class="feedback-item" id="fb_${f.id}">
      <div class="feedback-header">
        <div>
          <div class="feedback-stars">${'★'.repeat(f.rating||0)}${'☆'.repeat(5-(f.rating||0))}</div>
          <div class="feedback-user">${f.name||'Anonymous'} · ${f.category||'General'} · ${timeAgo(f.time)}</div>
        </div>
        <button class="btn btn-danger btn-sm btn-icon" onclick="deleteFeedback('${f.id}')"><i class="fas fa-trash"></i></button>
      </div>
      <div class="feedback-text">${f.text}</div>
    </div>
  `).join('');
}

function filterFeedback(rating) {
  const feedbacks = EverestDB.get('feedback', []);
  const filtered = rating ? feedbacks.filter(f=>f.rating===parseInt(rating)) : feedbacks;
  document.getElementById('feedbackList').innerHTML = renderFeedbackList(filtered);
}

function setRating(val) {
  window._currentRating = val;
  document.querySelectorAll('#starRating span').forEach((el,i) => {
    el.classList.toggle('active', i < val);
  });
}

function submitFeedback() {
  const text = document.getElementById('fb_text').value.trim();
  const rating = window._currentRating || 0;
  if (!text) { showToast('Please write a message!', 'error'); return; }
  if (!rating) { showToast('Please select a rating!', 'error'); return; }
  const feedbacks = EverestDB.get('feedback', []);
  feedbacks.push({
    id: genId(),
    name: document.getElementById('fb_name').value.trim() || 'Anonymous',
    category: document.getElementById('fb_cat').value,
    text, rating, time: Date.now()
  });
  EverestDB.set('feedback', feedbacks);
  showToast('Feedback submitted!', 'success');
  logActivity(`New ${rating}★ feedback received`, 'info');
  addNotification(`New feedback submitted (${rating}★)`, 'fa-star');
  renderFeedback();
}

function deleteFeedback(id) {
  let feedbacks = EverestDB.get('feedback', []);
  feedbacks = feedbacks.filter(f => f.id !== id);
  EverestDB.set('feedback', feedbacks);
  document.getElementById('fb_' + id)?.remove();
  showToast('Feedback deleted.', 'error');
}

function clearAllFeedback() {
  if (!confirm('Clear all feedback?')) return;
  EverestDB.set('feedback', []);
  showToast('All feedback cleared.', 'info');
  renderFeedback();
}