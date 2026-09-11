<?php
/**
 * GenZ Time - Publish New Hardware Review Studio
 */

require_once __DIR__ . '/../config/site.php';
require_once __DIR__ . '/../includes/db-helper.php';
require_once __DIR__ . '/../includes/seo-helper.php';
require_once __DIR__ . '/../includes/eeat-helper.php';
require_once __DIR__ . '/auth.php';

$adminTitle = 'Publish New Hardware Review';
$adminNav = 'publish';

$categories = db_get_categories();
$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $slug = trim($_POST['slug'] ?? '');
    $categorySlug = trim($_POST['category_slug'] ?? 'smartphones');
    $excerpt = trim($_POST['excerpt'] ?? '');
    $content = trim($_POST['content'] ?? '');
    $featuredImage = trim($_POST['featured_image'] ?? 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80');
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

    // Find category name
    $categoryName = 'Hardware';
    foreach ($categories as $c) {
        if ($c['slug'] === $categorySlug) {
            $categoryName = $c['name'];
            break;
        }
    }

    if (empty($title) || empty($content)) {
        $error = 'Review Title and Article Content are required.';
    } else {
        if (empty($slug)) {
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title), '-'));
        }

        // Calculate initial scores
        $postData = [
            'id'               => 'post-' . round(microtime(true) * 1000),
            'title'            => $title,
            'slug'             => $slug,
            'excerpt'          => $excerpt,
            'content'          => $content,
            'featuredImage'    => $featuredImage,
            'category'         => $categoryName,
            'categorySlug'     => $categorySlug,
            'tags'             => $tags,
            'author'           => [
                'name'   => SITE_AUTHOR,
                'role'   => SITE_AUTHOR_ROLE,
                'avatar' => SITE_AUTHOR_AVATAR,
                'bio'    => SITE_AUTHOR_BIO
            ],
            'publishedAt'      => date('Y-m-d H:i:s'),
            'updatedAt'        => date('Y-m-d H:i:s'),
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
                'canonicalUrl'    => BASE_URL . '/post.php?slug=' . urlencode($slug)
            ],
            'isFeatured'       => !empty($_POST['is_featured']),
            'isTrending'       => !empty($_POST['is_trending']),
            'views'            => 1,
            'originalityScore' => (int)($_POST['originality_score'] ?? 98),
            'eeatScore'        => 94
        ];

        // Recalculate E-E-A-T score
        $eeat = calculate_eeat_score($postData);
        $postData['eeatScore'] = $eeat['score'];

        if (db_save_post($postData)) {
            header('Location: ' . url('admin/index.php?msg=published'));
            exit;
        } else {
            $error = 'Failed to record review into database or fallback store.';
        }
    }
}

require_once __DIR__ . '/header.php';
?>

<div class="container" style="max-width: 1180px;">
  <div style="margin-bottom: 24px;">
    <nav style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--text-dim); margin-bottom: 12px;">
      <a href="<?= url('admin/index.php') ?>">Dashboard</a>
      <span>/</span>
      <span style="color: var(--accent-cyan-light);">Publish Hardware Review</span>
    </nav>
    <h1 style="font-size: 2.2rem; color: #fff;">Hardware Review Publishing Studio</h1>
    <p style="color: var(--text-muted); font-size: 0.95rem;">
      Full-spectrum gadget review composer equipped with Real-time SEO Scoring, Plagiarism Scanner, Humanizer, and Google E-E-A-T Evaluator.
    </p>
  </div>

  <?php if ($error): ?>
  <div style="background: rgba(244, 63, 94, 0.1); border: 1px solid var(--accent-rose); color: #FB7185; padding: 14px; border-radius: 8px; margin-bottom: 24px;">
    <i class="fa-solid fa-triangle-exclamation"></i> <?= e($error) ?>
  </div>
  <?php endif; ?>

  <form method="POST" id="publish-form">
    <input type="hidden" name="hidden_seo_score" id="hidden-seo-score" value="85">
    <input type="hidden" name="originality_score" id="hidden-orig-score" value="98">

    <div style="display: grid; grid-template-columns: 2.1fr 1fr; gap: 32px; align-items: start;">
      
      <!-- Left: Main Review Content & Hardware Data -->
      <div>
        
        <!-- Review Title & Slug Card -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 28px; margin-bottom: 24px;">
          <div class="form-group">
            <label class="form-label" style="font-size: 1rem;">Hardware Review Title *</label>
            <input type="text" name="title" id="post-title" required placeholder="e.g. Asus ROG Ally X Review: The New Handheld Benchmark" class="form-input" style="font-size: 1.1rem; font-weight: 600;">
          </div>

          <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label">SEO Slug</label>
              <input type="text" name="slug" id="post-slug" placeholder="asus-rog-ally-x-review" class="form-input mono" style="font-size: 0.85rem;">
            </div>
            <div class="form-group">
              <label class="form-label">Hardware Category</label>
              <select name="category_slug" id="post-category" class="form-select">
                <?php foreach ($categories as $c): ?>
                <option value="<?= e($c['slug']) ?>"><?= e($c['name']) ?></option>
                <?php endforeach; ?>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Excerpt / Quick Verdict Teaser</label>
            <textarea name="excerpt" id="post-excerpt" placeholder="Doubling battery capacity to 80Wh, adding 24GB of LPDDR5X-7500 RAM, and perfecting handheld thermals..." class="form-textarea" style="min-height: 80px;"></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Featured Image URL</label>
            <input type="url" name="featured_image" id="post-featured-image" value="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80" required class="form-input">
          </div>
        </div>

        <!-- Review Body Composer & Plagiarism Engine Card -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 28px; margin-bottom: 24px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
            <label class="form-label" style="font-size: 1rem; margin: 0;">In-Depth Article Body (Markdown Supported) *</label>
            
            <!-- Plagiarism / Humanizer Action Buttons -->
            <div style="display: flex; gap: 8px;">
              <button type="button" id="btn-scan-plagiarism" class="btn btn-secondary btn-sm" title="Scan for generic press release duplication and clichés">
                <i class="fa-solid fa-fingerprint"></i> Scan Originality &amp; Plagiarism
              </button>
              <button type="button" id="btn-humanize" class="btn btn-cyber btn-sm" title="1-Click replace generic phrasing with authentic lab voice">
                <i class="fa-solid fa-wand-magic-sparkles"></i> Remove Plagiarism &amp; Humanize
              </button>
            </div>
          </div>

          <!-- Plagiarism Results Alert Box -->
          <div id="plagiarism-report-box" style="display: none; background: #0A1120; border: 1px solid var(--border-cyan); border-radius: 8px; padding: 16px; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
              <div style="font-size: 0.85rem; font-weight: 700; color: #fff;">
                <i class="fa-solid fa-shield-halved" style="color: var(--accent-cyan);"></i> Plagiarism &amp; Originality Audit
              </div>
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.95rem; font-weight: 700;">
                Originality: <span id="plagiarism-score-display" style="color: #10B981;">98%</span>
              </div>
            </div>
            <div id="plagiarism-status-display" style="font-size: 0.78rem; color: var(--text-dim); margin-bottom: 8px;"></div>
            <div id="plagiarism-flagged-list"></div>
          </div>

          <textarea name="content" id="post-content" required placeholder="## Handheld PC Gaming Elevated&#10;&#10;In our 72-hour bench testing, we measured the sustained thermal wattage...&#10;&#10;### Battery Endurance Benchmarks&#10;&#10;- Battery run-time logged at 3.5 hours under sustained 25W turbo&#10;- Peak skin temperatures remained under 41°C" class="form-textarea" style="min-height: 380px; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; line-height: 1.6;"></textarea>
          <small style="color: var(--text-dim); font-size: 0.75rem;">Supports ## H2 subheadings, ### H3 subheadings, **bold**, and bullet points (-).</small>
        </div>

        <!-- Hardware Specifications Table Builder -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 28px; margin-bottom: 24px;">
          <h3 style="font-size: 1.15rem; color: #fff; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-microchip" style="color: var(--accent-cyan);"></i> Lab Hardware Specifications
          </h3>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 20px;">Populate hardware specs to fulfill Google E-E-A-T technical expertise criteria.</p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label">Processor / SoC</label>
              <input type="text" name="spec_processor" placeholder="e.g. AMD Ryzen Z1 Extreme (8 cores, 16 threads)" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">Display &amp; Refresh Rate</label>
              <input type="text" name="spec_display" placeholder="e.g. 7-inch FHD (1920x1080) 120Hz 500 nits" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">RAM &amp; Memory Type</label>
              <input type="text" name="spec_ram" placeholder="e.g. 24GB LPDDR5X-7500" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">Storage Interface</label>
              <input type="text" name="spec_storage" placeholder="e.g. 1TB PCIe 4.0 NVMe M.2 2280" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">Battery Capacity</label>
              <input type="text" name="spec_battery" placeholder="e.g. 80Wh 4-cell Li-ion" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">Dimensions / Weight</label>
              <input type="text" name="spec_weight" placeholder="e.g. 678g" class="form-input">
            </div>
          </div>
        </div>

        <!-- Pros & Cons Editor -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 28px; margin-bottom: 24px;">
          <h3 style="font-size: 1.15rem; color: #fff; margin-bottom: 16px;">Pros &amp; Cons Scrutiny</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div class="form-group">
              <label class="form-label" style="color: #34D399;"><i class="fa-solid fa-circle-check"></i> High Points (1 per line)</label>
              <textarea name="pros" placeholder="Massive 80Wh battery doubles runtime&#10;24GB RAM resolves memory bottlenecks&#10;Dual USB-C with USB4 support" class="form-textarea" style="min-height: 110px;"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label" style="color: #FB7185;"><i class="fa-solid fa-circle-xmark"></i> Compromises (1 per line)</label>
              <textarea name="cons" placeholder="Still runs Windows 11 desktop UI&#10;Heavier than predecessor (678g)" class="form-textarea" style="min-height: 110px;"></textarea>
            </div>
          </div>
        </div>

        <!-- GenZ Time Verdict Box Fields -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 28px; margin-bottom: 24px;">
          <h3 style="font-size: 1.15rem; color: #fff; margin-bottom: 16px;">Final Numerical Verdict</h3>
          <div style="display: grid; grid-template-columns: 180px 1fr; gap: 20px;">
            <div class="form-group">
              <label class="form-label">Score (out of 10)</label>
              <input type="number" name="verdict_score" step="0.1" min="1" max="10" value="9.2" required class="form-input" style="font-size: 1.2rem; font-weight: 700; color: var(--accent-emerald);">
            </div>
            <div class="form-group">
              <label class="form-label">Executive Verdict Summary</label>
              <textarea name="verdict_summary" placeholder="The definitive gaming handheld with battery endurance that finally lasts long flights..." class="form-textarea" style="min-height: 70px;"></textarea>
            </div>
          </div>
        </div>

      </div>

      <!-- Right Column: Live SEO Auditor & Publishing Actions -->
      <div style="position: sticky; top: 90px;">
        
        <!-- Live SEO Auditor Card -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-cyan); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 24px; box-shadow: var(--glow-cyan);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <h3 style="font-size: 1.1rem; color: #fff; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-chart-pie" style="color: var(--accent-cyan);"></i> Real-Time SEO Score
            </h3>
            <div style="font-family: 'Space Grotesk', sans-serif; font-size: 1.6rem; font-weight: 800;" id="seo-score-display">
              85%
            </div>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 16px;" id="seo-rating-display">Exceptional</div>

          <!-- 1-Click Auto-SEO Generator Button -->
          <button type="button" id="btn-auto-seo" class="btn btn-primary btn-sm" style="width: 100%; margin-bottom: 20px;">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Auto-Generate High-Level SEO &amp; Keywords
          </button>

          <!-- Focus Keyword -->
          <div class="form-group">
            <label class="form-label" style="font-size: 0.82rem;">Focus Keyword *</label>
            <input type="text" name="focus_keyword" id="post-focus-keyword" placeholder="e.g. Asus ROG Ally X review" class="form-input" style="font-size: 0.85rem;">
          </div>

          <!-- LSI Tags -->
          <div class="form-group">
            <label class="form-label" style="font-size: 0.82rem;">LSI Keywords &amp; Tags (comma separated)</label>
            <input type="text" name="tags" id="post-tags" placeholder="Asus, ROG Ally X, Handheld Gaming, Steam Deck" class="form-input" style="font-size: 0.85rem;">
          </div>

          <!-- Meta Title -->
          <div class="form-group">
            <label class="form-label" style="font-size: 0.82rem;">SEO Meta Title</label>
            <input type="text" name="meta_title" id="post-meta-title" placeholder="Asus ROG Ally X Review: Battery Champion | <?= SITE_NAME ?>" class="form-input" style="font-size: 0.85rem;">
          </div>

          <!-- Meta Description -->
          <div class="form-group">
            <label class="form-label" style="font-size: 0.82rem;">SEO Meta Description</label>
            <textarea name="meta_description" id="post-meta-desc" placeholder="Comprehensive hands-on Asus ROG Ally X review with 80Wh battery benchmarks..." class="form-textarea" style="font-size: 0.82rem; min-height: 80px;"></textarea>
          </div>

          <!-- Itemized SEO Checklist -->
          <div style="border-top: 1px solid var(--border-subtle); padding-top: 16px; margin-top: 16px;">
            <div style="font-size: 0.8rem; font-weight: 700; color: #fff; margin-bottom: 10px;">Google Ranking Checklist</div>
            <ul id="seo-checklist" style="list-style: none; padding: 0; margin: 0;"></ul>
          </div>
        </div>

        <!-- Publishing Status Card -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 24px;">
          <h4 style="font-size: 1rem; color: #fff; margin-bottom: 16px;">Publishing Controls</h4>
          
          <div style="margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px;">
            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #CBD5E1; cursor: pointer;">
              <input type="checkbox" name="is_featured" value="1"> Feature on Homepage Spotlight
            </label>
            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #CBD5E1; cursor: pointer;">
              <input type="checkbox" name="is_trending" value="1"> Add to Trending Ticker
            </label>
          </div>

          <div class="form-group">
            <label class="form-label" style="font-size: 0.82rem;">Reading Time</label>
            <input type="text" name="reading_time" value="6 min read" class="form-input" style="font-size: 0.85rem;">
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 1rem;">
            <i class="fa-solid fa-cloud-arrow-up"></i> Publish Review Live
          </button>
        </div>

      </div>

    </div>
  </form>
</div>

<?php require_once __DIR__ . '/footer.php'; ?>
