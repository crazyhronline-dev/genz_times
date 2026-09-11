<?php
/**
 * GenZ Time - Edit Hardware Review
 */

require_once __DIR__ . '/../config/site.php';
require_once __DIR__ . '/../includes/db-helper.php';
require_once __DIR__ . '/../includes/seo-helper.php';
require_once __DIR__ . '/../includes/eeat-helper.php';
require_once __DIR__ . '/auth.php';

$adminTitle = 'Edit Hardware Review';
$adminNav = 'edit';

$id = trim($_GET['id'] ?? '');
if (empty($id)) {
    header('Location: ' . url('admin/index.php'));
    exit;
}

$post = db_get_post_by_id($id);
if (!$post) {
    header('Location: ' . url('admin/index.php?error=notfound'));
    exit;
}

$categories = db_get_categories();
$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $slug = trim($_POST['slug'] ?? '');
    $categorySlug = trim($_POST['category_slug'] ?? 'smartphones');
    $excerpt = trim($_POST['excerpt'] ?? '');
    $content = trim($_POST['content'] ?? '');
    $featuredImage = trim($_POST['featured_image'] ?? $post['featuredImage']);
    $verdictScore = (float)($_POST['verdict_score'] ?? 9.0);
    $verdictSummary = trim($_POST['verdict_summary'] ?? '');
    $readingTime = trim($_POST['reading_time'] ?? '6 min read');
    
    // SEO fields
    $focusKeyword = trim($_POST['focus_keyword'] ?? '');
    $metaTitle = trim($_POST['meta_title'] ?? $title);
    $metaDescription = trim($_POST['meta_description'] ?? $excerpt);
    $tagsRaw = trim($_POST['tags'] ?? '');
    $tags = array_filter(array_map('trim', explode(',', $tagsRaw)));

    // Specs
    $specs = [
        'processor' => trim($_POST['spec_processor'] ?? ''),
        'display'   => trim($_POST['spec_display'] ?? ''),
        'ram'       => trim($_POST['spec_ram'] ?? ''),
        'storage'   => trim($_POST['spec_storage'] ?? ''),
        'battery'   => trim($_POST['spec_battery'] ?? ''),
        'weight'    => trim($_POST['spec_weight'] ?? ''),
        'price'     => trim($_POST['spec_price'] ?? '')
    ];
    $specs = array_filter($specs);

    // Pros & Cons
    $prosRaw = trim($_POST['pros'] ?? '');
    $pros = array_filter(array_map('trim', explode("\n", $prosRaw)));
    
    $consRaw = trim($_POST['cons'] ?? '');
    $cons = array_filter(array_map('trim', explode("\n", $consRaw)));

    // Category Name
    $categoryName = 'Hardware';
    foreach ($categories as $c) {
        if ($c['slug'] === $categorySlug) {
            $categoryName = $c['name'];
            break;
        }
    }

    if (empty($title) || empty($content)) {
        $error = 'Review Title and Content cannot be empty.';
    } else {
        $updatedData = [
            'id'               => $id,
            'title'            => $title,
            'slug'             => $slug ?: $post['slug'],
            'excerpt'          => $excerpt,
            'content'          => $content,
            'featuredImage'    => $featuredImage,
            'category'         => $categoryName,
            'categorySlug'     => $categorySlug,
            'tags'             => $tags,
            'readingTime'      => $readingTime,
            'verdictScore'     => $verdictScore,
            'verdictSummary'   => $verdictSummary,
            'pros'             => $pros,
            'cons'             => $cons,
            'specs'            => $specs,
            'seo'              => [
                'metaTitle'       => $metaTitle,
                'metaDescription' => $metaDescription,
                'focusKeyword'    => $focusKeyword,
                'canonicalUrl'    => BASE_URL . '/post.php?slug=' . urlencode($slug ?: $post['slug'])
            ],
            'isFeatured'       => !empty($_POST['is_featured']),
            'isTrending'       => !empty($_POST['is_trending']),
            'originalityScore' => (int)($_POST['originality_score'] ?? $post['originalityScore'] ?? 98),
            'eeatScore'        => 94
        ];

        // Recalculate E-E-A-T score
        $eeat = calculate_eeat_score($updatedData);
        $updatedData['eeatScore'] = $eeat['score'];

        if (db_update_post($id, $updatedData)) {
            $success = 'Review changes saved successfully!';
            $post = db_get_post_by_id($id);
        } else {
            $error = 'Failed to persist changes.';
        }
    }
}

require_once __DIR__ . '/header.php';
?>

<div class="container" style="max-width: 1180px;">
  <div style="margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between;">
    <div>
      <nav style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--text-dim); margin-bottom: 8px;">
        <a href="<?= url('admin/index.php') ?>">Dashboard</a>
        <span>/</span>
        <span style="color: var(--accent-cyan-light);">Edit Review</span>
      </nav>
      <h1 style="font-size: 2.2rem; color: #fff;">Edit: <?= e($post['title']) ?></h1>
    </div>
    <a href="<?= url('post.php?slug=' . urlencode($post['slug'])) ?>" target="_blank" class="btn btn-secondary btn-sm">
      <i class="fa-solid fa-eye"></i> View Live Review
    </a>
  </div>

  <?php if ($success): ?>
  <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--accent-emerald); color: #34D399; padding: 14px; border-radius: 8px; margin-bottom: 24px;">
    <i class="fa-solid fa-circle-check"></i> <?= e($success) ?>
  </div>
  <?php endif; ?>

  <?php if ($error): ?>
  <div style="background: rgba(244, 63, 94, 0.1); border: 1px solid var(--accent-rose); color: #FB7185; padding: 14px; border-radius: 8px; margin-bottom: 24px;">
    <i class="fa-solid fa-triangle-exclamation"></i> <?= e($error) ?>
  </div>
  <?php endif; ?>

  <form method="POST" id="publish-form">
    <input type="hidden" name="originality_score" id="hidden-orig-score" value="<?= $post['originalityScore'] ?? 98 ?>">
    <input type="hidden" name="hidden_seo_score" id="hidden-seo-score" value="90">

    <div style="display: grid; grid-template-columns: 2.1fr 1fr; gap: 32px; align-items: start;">
      
      <!-- Left Column -->
      <div>
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 28px; margin-bottom: 24px;">
          <div class="form-group">
            <label class="form-label">Review Title *</label>
            <input type="text" name="title" id="post-title" value="<?= e($post['title']) ?>" required class="form-input" style="font-size: 1.1rem; font-weight: 600;">
          </div>

          <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label">SEO Slug</label>
              <input type="text" name="slug" id="post-slug" value="<?= e($post['slug']) ?>" class="form-input mono" style="font-size: 0.85rem;">
            </div>
            <div class="form-group">
              <label class="form-label">Category</label>
              <select name="category_slug" id="post-category" class="form-select">
                <?php foreach ($categories as $c): ?>
                <option value="<?= e($c['slug']) ?>" <?= ($post['categorySlug'] ?? '') === $c['slug'] ? 'selected' : '' ?>>
                  <?= e($c['name']) ?>
                </option>
                <?php endforeach; ?>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Excerpt / Teaser</label>
            <textarea name="excerpt" id="post-excerpt" class="form-textarea" style="min-height: 80px;"><?= e($post['excerpt']) ?></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Featured Image URL</label>
            <input type="url" name="featured_image" value="<?= e($post['featuredImage']) ?>" required class="form-input">
          </div>
        </div>

        <!-- Body & Plagiarism -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 28px; margin-bottom: 24px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
            <label class="form-label" style="font-size: 1rem; margin: 0;">Article Content *</label>
            
            <div style="display: flex; gap: 8px;">
              <button type="button" id="btn-scan-plagiarism" class="btn btn-secondary btn-sm">
                <i class="fa-solid fa-fingerprint"></i> Scan Plagiarism
              </button>
              <button type="button" id="btn-humanize" class="btn btn-cyber btn-sm">
                <i class="fa-solid fa-wand-magic-sparkles"></i> Remove Plagiarism &amp; Humanize
              </button>
            </div>
          </div>

          <!-- Plagiarism Alert Box -->
          <div id="plagiarism-report-box" style="display: none; background: #0A1120; border: 1px solid var(--border-cyan); border-radius: 8px; padding: 16px; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <strong style="color: #fff;"><i class="fa-solid fa-shield-halved" style="color: var(--accent-cyan);"></i> Plagiarism &amp; Originality Audit</strong>
              <span id="plagiarism-score-display" style="font-weight: 700; color: #10B981;">98%</span>
            </div>
            <div id="plagiarism-status-display" style="font-size: 0.78rem; color: var(--text-dim); margin-bottom: 8px;"></div>
            <div id="plagiarism-flagged-list"></div>
          </div>

          <textarea name="content" id="post-content" required class="form-textarea" style="min-height: 380px; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; line-height: 1.6;"><?= e($post['content']) ?></textarea>
        </div>

        <!-- Hardware Specs Builder -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 28px; margin-bottom: 24px;">
          <h3 style="font-size: 1.15rem; color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-microchip" style="color: var(--accent-cyan);"></i> Hardware Specifications
          </h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label">Processor</label>
              <input type="text" name="spec_processor" value="<?= e($post['specs']['processor'] ?? '') ?>" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">Display</label>
              <input type="text" name="spec_display" value="<?= e($post['specs']['display'] ?? '') ?>" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">RAM</label>
              <input type="text" name="spec_ram" value="<?= e($post['specs']['ram'] ?? '') ?>" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">Storage</label>
              <input type="text" name="spec_storage" value="<?= e($post['specs']['storage'] ?? '') ?>" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">Battery</label>
              <input type="text" name="spec_battery" value="<?= e($post['specs']['battery'] ?? '') ?>" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">Weight</label>
              <input type="text" name="spec_weight" value="<?= e($post['specs']['weight'] ?? '') ?>" class="form-input">
            </div>
          </div>
        </div>

        <!-- Pros & Cons -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 28px; margin-bottom: 24px;">
          <h3 style="font-size: 1.15rem; color: #fff; margin-bottom: 16px;">Pros &amp; Cons</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div class="form-group">
              <label class="form-label" style="color: #34D399;"><i class="fa-solid fa-circle-check"></i> High Points</label>
              <textarea name="pros" class="form-textarea" style="min-height: 110px;"><?= e(implode("\n", $post['pros'] ?? [])) ?></textarea>
            </div>
            <div class="form-group">
              <label class="form-label" style="color: #FB7185;"><i class="fa-solid fa-circle-xmark"></i> Compromises</label>
              <textarea name="cons" class="form-textarea" style="min-height: 110px;"><?= e(implode("\n", $post['cons'] ?? [])) ?></textarea>
            </div>
          </div>
        </div>

        <!-- Verdict Score -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 28px; margin-bottom: 24px;">
          <h3 style="font-size: 1.15rem; color: #fff; margin-bottom: 16px;">Final Verdict</h3>
          <div style="display: grid; grid-template-columns: 180px 1fr; gap: 20px;">
            <div class="form-group">
              <label class="form-label">Score (out of 10)</label>
              <input type="number" name="verdict_score" step="0.1" min="1" max="10" value="<?= number_format($post['verdictScore'], 1) ?>" required class="form-input" style="font-size: 1.2rem; font-weight: 700; color: var(--accent-emerald);">
            </div>
            <div class="form-group">
              <label class="form-label">Summary</label>
              <textarea name="verdict_summary" class="form-textarea" style="min-height: 70px;"><?= e($post['verdictSummary']) ?></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div style="position: sticky; top: 90px;">
        <!-- Real-Time SEO -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-cyan); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 24px; box-shadow: var(--glow-cyan);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <h3 style="font-size: 1.1rem; color: #fff; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-chart-pie" style="color: var(--accent-cyan);"></i> Real-Time SEO
            </h3>
            <div style="font-family: 'Space Grotesk', sans-serif; font-size: 1.6rem; font-weight: 800;" id="seo-score-display">
              88%
            </div>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 16px;" id="seo-rating-display">Exceptional</div>

          <button type="button" id="btn-auto-seo" class="btn btn-primary btn-sm" style="width: 100%; margin-bottom: 20px;">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Auto-Generate High-Level SEO &amp; Keywords
          </button>

          <div class="form-group">
            <label class="form-label" style="font-size: 0.82rem;">Focus Keyword</label>
            <input type="text" name="focus_keyword" id="post-focus-keyword" value="<?= e($post['seo']['focusKeyword'] ?? '') ?>" class="form-input" style="font-size: 0.85rem;">
          </div>

          <div class="form-group">
            <label class="form-label" style="font-size: 0.82rem;">LSI Keywords &amp; Tags</label>
            <input type="text" name="tags" id="post-tags" value="<?= e(implode(', ', $post['tags'] ?? [])) ?>" class="form-input" style="font-size: 0.85rem;">
          </div>

          <div class="form-group">
            <label class="form-label" style="font-size: 0.82rem;">Meta Title</label>
            <input type="text" name="meta_title" id="post-meta-title" value="<?= e($post['seo']['metaTitle'] ?? '') ?>" class="form-input" style="font-size: 0.85rem;">
          </div>

          <div class="form-group">
            <label class="form-label" style="font-size: 0.82rem;">Meta Description</label>
            <textarea name="meta_description" id="post-meta-desc" class="form-textarea" style="font-size: 0.82rem; min-height: 80px;"><?= e($post['seo']['metaDescription'] ?? '') ?></textarea>
          </div>

          <div style="border-top: 1px solid var(--border-subtle); padding-top: 16px; margin-top: 16px;">
            <div style="font-size: 0.8rem; font-weight: 700; color: #fff; margin-bottom: 10px;">Google Ranking Checklist</div>
            <ul id="seo-checklist" style="list-style: none; padding: 0; margin: 0;"></ul>
          </div>
        </div>

        <!-- Controls -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 24px;">
          <h4 style="font-size: 1rem; color: #fff; margin-bottom: 16px;">Publishing Controls</h4>
          
          <div style="margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px;">
            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #CBD5E1; cursor: pointer;">
              <input type="checkbox" name="is_featured" value="1" <?= !empty($post['isFeatured']) ? 'checked' : '' ?>> Feature on Homepage Spotlight
            </label>
            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #CBD5E1; cursor: pointer;">
              <input type="checkbox" name="is_trending" value="1" <?= !empty($post['isTrending']) ? 'checked' : '' ?>> Add to Trending Ticker
            </label>
          </div>

          <div class="form-group">
            <label class="form-label" style="font-size: 0.82rem;">Reading Time</label>
            <input type="text" name="reading_time" value="<?= e($post['readingTime'] ?? '6 min read') ?>" class="form-input" style="font-size: 0.85rem;">
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 1rem;">
            <i class="fa-solid fa-floppy-disk"></i> Update Review Changes
          </button>
        </div>
      </div>

    </div>
  </form>
</div>

<?php require_once __DIR__ . '/footer.php'; ?>
