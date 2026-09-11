/**
 * GenZ Time - Main Interactive UI Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // Real-time Blog Search Filter
  const searchInput = document.getElementById('archive-search');
  const postCards = document.querySelectorAll('.archive-post-card');

  if (searchInput && postCards.length > 0) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      postCards.forEach(card => {
        const title = (card.getAttribute('data-title') || '').toLowerCase();
        const category = (card.getAttribute('data-category') || '').toLowerCase();
        const excerpt = (card.getAttribute('data-excerpt') || '').toLowerCase();

        if (!query || title.includes(query) || category.includes(query) || excerpt.includes(query)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // Handle Comment Submission on single post page
  const commentForm = document.getElementById('comment-form');
  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('comment-name')?.value.trim();
      const handle = document.getElementById('comment-handle')?.value.trim();
      const message = document.getElementById('comment-message')?.value.trim();

      if (!name || !message) {
        alert('Please provide your name and your comment message.');
        return;
      }

      // Optimistically append comment
      const list = document.getElementById('comments-list');
      if (list) {
        const item = document.createElement('div');
        item.className = 'comment-item';
        item.innerHTML = `
          <div class="comment-author-row">
            <div>
              <strong style="color: #fff;">${escapeHtml(name)}</strong>
              <span style="color: #06B6D4; font-size: 0.8rem; margin-left: 6px;">${escapeHtml(handle || '@verified_reader')}</span>
            </div>
            <span style="color: #64748B; font-size: 0.75rem;">Just now</span>
          </div>
          <p style="color: #CBD5E1; font-size: 0.92rem; margin: 0;">${escapeHtml(message)}</p>
        `;
        list.prepend(item);
        commentForm.reset();
        alert('Thank you for contributing to the GenZ Time hardware discussion!');
      }
    });
  }
});

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}
