/**
 * GenZ Time - Admin CMS Studio Scripts
 * Real-time SEO Audit, Plagiarism Scanner, Humanizer & Auto-SEO
 */

document.addEventListener('DOMContentLoaded', () => {
  const titleInput = document.getElementById('post-title');
  const slugInput = document.getElementById('post-slug');
  const categorySelect = document.getElementById('post-category');
  const contentInput = document.getElementById('post-content');
  const excerptInput = document.getElementById('post-excerpt');
  const focusKeywordInput = document.getElementById('post-focus-keyword');
  const tagsInput = document.getElementById('post-tags');
  const metaTitleInput = document.getElementById('post-meta-title');
  const metaDescInput = document.getElementById('post-meta-desc');

  // Slug generator
  if (titleInput && slugInput) {
    titleInput.addEventListener('input', () => {
      if (!slugInput.dataset.manual) {
        slugInput.value = titleInput.value
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      runLiveAudit();
    });

    slugInput.addEventListener('input', () => {
      slugInput.dataset.manual = 'true';
    });
  }

  // Inputs triggering live SEO audit
  [contentInput, excerptInput, focusKeywordInput, metaTitleInput, metaDescInput].forEach(el => {
    if (el) el.addEventListener('input', runLiveAudit);
  });

  // 1-Click Auto-Generate SEO & Keywords Button
  const btnAutoSeo = document.getElementById('btn-auto-seo');
  if (btnAutoSeo) {
    btnAutoSeo.addEventListener('click', async () => {
      const title = titleInput?.value.trim() || '';
      const content = contentInput?.value.trim() || '';
      const category = categorySelect?.value || '';

      if (!title) {
        alert('Please enter a review title before auto-generating SEO.');
        return;
      }

      btnAutoSeo.disabled = true;
      btnAutoSeo.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating High-Intent SEO...';

      try {
        const res = await fetch('api.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'auto_seo',
            title,
            category,
            content
          })
        });
        const json = await res.json();

        if (json.success && json.data) {
          const d = json.data;
          if (focusKeywordInput) focusKeywordInput.value = d.focusKeyword;
          if (metaTitleInput) metaTitleInput.value = d.metaTitle;
          if (metaDescInput) metaDescInput.value = d.metaDescription;
          if (tagsInput && d.tags) tagsInput.value = d.tags.join(', ');

          // Re-run live audit
          runLiveAudit();
          alert('⚡ High-Level SEO Generated: Focus keyword, LSI tags, optimized meta title, and high-CTR description are populated!');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to auto-generate SEO. Check network or server logs.');
      } finally {
        btnAutoSeo.disabled = false;
        btnAutoSeo.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Auto-Generate High-Level SEO &amp; Keywords';
      }
    });
  }

  // Plagiarism Scanner Button
  const btnScanPlagiarism = document.getElementById('btn-scan-plagiarism');
  if (btnScanPlagiarism) {
    btnScanPlagiarism.addEventListener('click', async () => {
      const content = contentInput?.value.trim() || '';
      if (!content) {
        alert('Please enter article content to scan for plagiarism and authenticity.');
        return;
      }

      btnScanPlagiarism.disabled = true;
      btnScanPlagiarism.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Scanning Originality...';

      try {
        const res = await fetch('api.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'check_plagiarism',
            content
          })
        });
        const json = await res.json();

        if (json.success && json.data) {
          renderPlagiarismResults(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        btnScanPlagiarism.disabled = false;
        btnScanPlagiarism.innerHTML = '<i class="fa-solid fa-fingerprint"></i> Scan Originality &amp; Plagiarism';
      }
    });
  }

  // 1-Click Remove Plagiarism & Humanize Button
  const btnHumanize = document.getElementById('btn-humanize');
  if (btnHumanize) {
    btnHumanize.addEventListener('click', async () => {
      const content = contentInput?.value.trim() || '';
      if (!content) {
        alert('Please provide content to humanize.');
        return;
      }

      btnHumanize.disabled = true;
      btnHumanize.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Humanizing Content...';

      try {
        const res = await fetch('api.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'humanize',
            content
          })
        });
        const json = await res.json();

        if (json.success && json.data) {
          contentInput.value = json.data.humanizedText;
          renderPlagiarismResults(json.data.audit);
          runLiveAudit();
          alert(`✨ Plagiarism Removed: ${json.data.replacementsMade} syndicated/AI clichés replaced with authentic lab voice. Originality is now ${json.data.newScore}%!`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        btnHumanize.disabled = false;
        btnHumanize.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Remove Plagiarism &amp; Humanize';
      }
    });
  }

  // Initial audit run on page load
  runLiveAudit();
});

// Live SEO Auditor function
async function runLiveAudit() {
  const title = document.getElementById('post-title')?.value || '';
  const excerpt = document.getElementById('post-excerpt')?.value || '';
  const content = document.getElementById('post-content')?.value || '';
  const focusKeyword = document.getElementById('post-focus-keyword')?.value || '';
  const metaTitle = document.getElementById('post-meta-title')?.value || '';
  const metaDesc = document.getElementById('post-meta-desc')?.value || '';

  try {
    const res = await fetch('api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'check_seo',
        title, excerpt, content, focusKeyword, metaTitle, metaDescription: metaDesc
      })
    });
    const json = await res.json();
    if (json.success && json.data) {
      renderSeoScore(json.data);
    }
  } catch (e) {
    // silently fail
  }
}

function renderSeoScore(data) {
  const scoreEl = document.getElementById('seo-score-display');
  const ratingEl = document.getElementById('seo-rating-display');
  const checklistEl = document.getElementById('seo-checklist');
  const hiddenScoreInput = document.getElementById('hidden-seo-score');

  if (scoreEl) scoreEl.textContent = data.score + '%';
  if (ratingEl) ratingEl.textContent = data.rating;
  if (hiddenScoreInput) hiddenScoreInput.value = data.score;

  // Set score color
  if (scoreEl) {
    if (data.score >= 85) scoreEl.style.color = '#10B981';
    else if (data.score >= 70) scoreEl.style.color = '#06B6D4';
    else scoreEl.style.color = '#F59E0B';
  }

  if (checklistEl && data.checks) {
    checklistEl.innerHTML = '';
    data.checks.forEach(c => {
      const li = document.createElement('li');
      li.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-size: 0.82rem;';
      const icon = c.pass 
        ? '<span style="color: #10B981; font-weight: bold;">✓</span>' 
        : '<span style="color: #F43F5E; font-weight: bold;">✕</span>';
      li.innerHTML = `${icon} <span style="color: ${c.pass ? '#CBD5E1' : '#94A3B8'};">${c.label}</span>`;
      checklistEl.appendChild(li);
    });
  }
}

function renderPlagiarismResults(data) {
  const box = document.getElementById('plagiarism-report-box');
  const scoreDisplay = document.getElementById('plagiarism-score-display');
  const statusDisplay = document.getElementById('plagiarism-status-display');
  const flaggedList = document.getElementById('plagiarism-flagged-list');
  const hiddenOrigInput = document.getElementById('hidden-orig-score');

  if (box) box.style.display = 'block';
  if (scoreDisplay) {
    scoreDisplay.textContent = data.originalityScore + '%';
    scoreDisplay.style.color = data.originalityScore >= 90 ? '#10B981' : '#F59E0B';
  }
  if (statusDisplay) statusDisplay.textContent = data.rating;
  if (hiddenOrigInput) hiddenOrigInput.value = data.originalityScore;

  if (flaggedList) {
    flaggedList.innerHTML = '';
    if (data.flagged && data.flagged.length > 0) {
      data.flagged.forEach(f => {
        const div = document.createElement('div');
        div.style.cssText = 'background: rgba(244, 63, 94, 0.08); border: 1px solid rgba(244, 63, 94, 0.3); padding: 8px 12px; border-radius: 6px; margin-bottom: 6px; font-size: 0.8rem;';
        div.innerHTML = `
          <div style="color: #FB7185; font-weight: 600;">Flagged: "${f.phrase}"</div>
          <div style="color: #94A3B8; font-size: 0.75rem;">Lab Alternative: <span style="color: #34D399;">"${f.suggested}"</span></div>
        `;
        flaggedList.appendChild(div);
      });
    } else {
      flaggedList.innerHTML = '<div style="color: #34D399; font-size: 0.85rem;"><i class="fa-solid fa-circle-check"></i> Zero duplicated or clichéd PR phrases detected! 100% authentic hardware test voice.</div>';
    }
  }
}
