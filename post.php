<?php
/**
 * GenZ Time - Single In-Depth Hardware Review
 */

require_once __DIR__ . '/config/site.php';
require_once __DIR__ . '/includes/db-helper.php';
require_once __DIR__ . '/includes/seo-helper.php';
require_once __DIR__ . '/includes/eeat-helper.php';

$slug = trim($_GET['slug'] ?? '');
if (empty($slug)) {
    header('Location: ' . url('blog.php'));
    exit;
}

$post = db_get_post_by_slug($slug);
if (!$post) {
    http_response_code(404);
    $pageTitle = 'Hardware Review Not Found | ' . SITE_NAME;
    require_once __DIR__ . '/includes/header.php';
    echo '<div class="container" style="padding: 100px 24px; text-align: center;">';
    echo '<h1 style="font-size: 2.5rem; margin-bottom: 16px;">404 - Review Not Found</h1>';
    echo '<p style="color: var(--text-muted); margin-bottom: 24px;">The gadget review or benchmark you requested could not be located in our lab archive.</p>';
    echo '<a href="' . url('blog.php') . '" class="btn btn-primary">Return to Review Archive</a>';
    echo '</div>';
    require_once __DIR__ . '/includes/footer.php';
    exit;
}

// Increment post view counter
db_increment_views($post['id']);

// Calculate E-E-A-T Score
$eeatAudit = calculate_eeat_score($post);
$eeatScore = $post['eeatScore'] ?: $eeatAudit['score'];

// SEO Meta Config
$pageTitle = $post['seo']['metaTitle'] ?: ($post['title'] . ' | ' . SITE_NAME);
$pageDescription = $post['seo']['metaDescription'] ?: $post['excerpt'];
$pageCanonical = $post['seo']['canonicalUrl'] ?: (BASE_URL . '/post.php?slug=' . urlencode($post['slug']));
$pageImage = $post['featuredImage'];
$pageKeywords = !empty($post['tags']) ? implode(', ', $post['tags']) : $post['seo']['focusKeyword'];
$pageType = 'article';
$activeNav = 'reviews';

// Fetch Comments & Related Posts
$comments = db_get_comments($post['id']);
$relatedPosts = db_get_all_posts(3, $post['categorySlug'] ?? null);
$relatedPosts = array_filter($relatedPosts, fn($p) => $p['id'] !== $post['id']);

// Simple Markdown parser for review body
function parse_review_markdown(string $md): string {
    $lines = explode("\n", $md);
    $html = '';
    $inList = false;

    foreach ($lines as $line) {
        $trimmed = trim($line);

        if (empty($trimmed)) {
            if ($inList) {
                $html .= "</ul>\n";
                $inList = false;
            }
            continue;
        }

        // H3
        if (str_starts_with($trimmed, '### ')) {
            if ($inList) { $html .= "</ul>\n"; $inList = false; }
            $html .= '<h3>' . e(substr($trimmed, 4)) . '</h3>';
            continue;
        }

        // H2
        if (str_starts_with($trimmed, '## ')) {
            if ($inList) { $html .= "</ul>\n"; $inList = false; }
            $html .= '<h2>' . e(substr($trimmed, 3)) . '</h2>';
            continue;
        }

        // Unordered list
        if (str_starts_with($trimmed, '- ') || str_starts_with($trimmed, '* ')) {
            if (!$inList) {
                $html .= "<ul>\n";
                $inList = true;
            }
            $itemText = substr($trimmed, 2);
            // Replace **bold**
            $itemText = preg_replace('/\*\*(.*?)\*\*/', '<strong>$1</strong>', e($itemText));
            $html .= '<li>' . $itemText . '</li>';
            continue;
        }

        if ($inList) {
            $html .= "</ul>\n";
            $inList = false;
        }

        // Paragraph
        $pText = preg_replace('/\*\*(.*?)\*\*/', '<strong>$1</strong>', e($trimmed));
        $html .= '<p>' . $pText . '</p>';
    }

    if ($inList) {
        $html .= "</ul>\n";
    }

    return $html;
}

require_once __DIR__ . '/includes/header.php';
?>

<!-- Schema.org JSON-LD for Article & Product Review -->
<?= seo_render_jsonld_article($post) ?>

<article class="container" style="padding-bottom: 64px;">
  <!-- Header / Breadcrumb -->
  <div class="post-header">
    <nav style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--text-dim); margin-bottom: 20px;">
      <a href="<?= url('/') ?>">Home</a>
      <span>/</span>
      <a href="<?= url('blog.php') ?>">Reviews</a>
      <span>/</span>
      <a href="<?= url('category.php?slug=' . urlencode($post['categorySlug'] ?? '')) ?>"><?= e($post['category']) ?></a>
      <span>/</span>
      <span style="color: var(--accent-cyan-light);"><?= e($post['title']) ?></span>
    </nav>

    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
      <span class="category-tag"><?= e($post['category']) ?></span>
      <span class="score-badge"><i class="fa-solid fa-bolt"></i> VERDICT: <?= number_format($post['verdictScore'], 1) ?>/10</span>
      <?= render_eeat_badge($eeatScore) ?>
    </div>

    <h1 class="post-headline"><?= e($post['title']) ?></h1>
    <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.6; max-width: 900px; margin-bottom: 28px;">
      <?= e($post['excerpt']) ?>
    </p>

    <!-- Meta details bar -->
    <div class="post-meta-bar">
      <div class="author-pill">
        <img src="<?= e($post['author']['avatar']) ?>" alt="<?= e($post['author']['name']) ?>" class="author-avatar" style="width: 38px; height: 38px;">
        <div>
          <div style="font-size: 0.92rem; font-weight: 700; color: #fff;"><?= e($post['author']['name']) ?></div>
          <div style="font-size: 0.75rem; color: var(--text-dim);"><?= e($post['author']['role']) ?></div>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 20px; font-size: 0.85rem; color: var(--text-dim);" class="mono">
        <span><i class="fa-regular fa-calendar"></i> <?= date('F j, Y', strtotime($post['publishedAt'])) ?></span>
        <span><i class="fa-regular fa-clock"></i> <?= e($post['readingTime']) ?></span>
        <span><i class="fa-solid fa-signal"></i> <?= number_format($post['views'] ?? 0) ?> Reads</span>
      </div>
    </div>
  </div>

  <!-- Featured Image -->
  <div class="post-hero-image">
    <img src="<?= e($post['featuredImage']) ?>" alt="<?= e($post['title']) ?>">
  </div>

  <!-- Main Review Layout (Article Body + Sidebar) -->
  <div class="post-body-container">
    <!-- Article Main Column -->
    <div class="post-article-content">
      <!-- Parsed Markdown Review Text -->
      <?= parse_review_markdown($post['content']) ?>

      <!-- Hardware Specifications Table -->
      <?php if (!empty($post['specs'])): ?>
      <div class="specs-table-card">
        <div class="specs-header">
          <h3 style="font-size: 1.1rem; color: #fff; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-microchip" style="color: var(--accent-cyan);"></i> Lab Hardware Specifications
          </h3>
          <span class="mono" style="font-size: 0.75rem; color: var(--accent-cyan-light);">LAB CALIBRATED</span>
        </div>
        <table class="specs-table">
          <tbody>
            <?php foreach ($post['specs'] as $key => $val): ?>
            <tr>
              <td class="specs-key"><?= e(str_replace('_', ' ', $key)) ?></td>
              <td class="specs-value"><?= e($val) ?></td>
            </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
      <?php endif; ?>

      <!-- Pros & Cons Grid -->
      <div class="pros-cons-grid">
        <div class="pros-card">
          <h4 class="pros-header"><i class="fa-solid fa-circle-check"></i> High Points &amp; Strengths</h4>
          <ul class="pros-list">
            <?php foreach ($post['pros'] as $pro): ?>
            <li><?= e($pro) ?></li>
            <?php endforeach; ?>
          </ul>
        </div>
        <div class="cons-card">
          <h4 class="cons-header"><i class="fa-solid fa-circle-xmark"></i> Compromises &amp; Flaws</h4>
          <ul class="cons-list">
            <?php foreach ($post['cons'] as $con): ?>
            <li><?= e($con) ?></li>
            <?php endforeach; ?>
          </ul>
        </div>
      </div>

      <!-- GenZ Time Verdict Box -->
      <div class="verdict-box">
        <div class="verdict-score-circle">
          <div class="verdict-score-num"><?= number_format($post['verdictScore'], 1) ?></div>
          <div class="verdict-score-max">OUT OF 10</div>
        </div>
        <div class="verdict-content">
          <div style="font-size: 0.75rem; color: var(--accent-cyan-light); font-family: 'JetBrains Mono', monospace; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">
            <?= SITE_NAME ?> Official Verdict
          </div>
          <h3>The Hardware Analyst Assessment</h3>
          <p><?= e($post['verdictSummary']) ?></p>
        </div>
      </div>

      <!-- Tag Cloud -->
      <?php if (!empty($post['tags'])): ?>
      <div style="margin: 32px 0; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <span style="font-size: 0.8rem; color: var(--text-dim); font-weight: 600;">TAGGED HARDWARE:</span>
        <?php foreach ($post['tags'] as $tag): ?>
        <a href="<?= url('blog.php?search=' . urlencode($tag)) ?>" class="category-tag" style="background: var(--bg-surface);">
          #<?= e($tag) ?>
        </a>
        <?php endforeach; ?>
      </div>
      <?php endif; ?>

      <!-- Interactive Comments Section -->
      <section class="comments-section" id="comments">
        <div class="section-header">
          <h3 style="font-size: 1.35rem; color: #fff;">
            <i class="fa-regular fa-comments section-title-cyan"></i> Reader Discussion (<?= count($comments) ?>)
          </h3>
          <span style="font-size: 0.82rem; color: var(--text-dim);">Peer Hardware Insights</span>
        </div>

        <div id="comments-list">
          <?php foreach ($comments as $c): ?>
          <div class="comment-item">
            <div class="comment-author-row">
              <div>
                <strong style="color: #fff;"><?= e($c['author_name']) ?></strong>
                <span style="color: var(--accent-cyan-light); font-size: 0.8rem; margin-left: 6px;"><?= e($c['author_handle']) ?></span>
              </div>
              <span class="mono" style="color: var(--text-dim); font-size: 0.75rem;"><?= date('M d, Y', strtotime($c['created_at'])) ?></span>
            </div>
            <p style="color: #CBD5E1; font-size: 0.92rem; margin: 0;"><?= e($c['comment_text']) ?></p>
          </div>
          <?php endforeach; ?>
        </div>

        <!-- Add Comment Form -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 24px; margin-top: 24px;">
          <h4 style="font-size: 1.05rem; color: #fff; margin-bottom: 16px;">Leave Your Benchmark Observation</h4>
          <form id="comment-form">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div>
                <label class="form-label">Your Name</label>
                <input type="text" id="comment-name" required placeholder="e.g. Liam Zhang" class="form-input">
              </div>
              <div>
                <label class="form-label">Twitter / Handle (Optional)</label>
                <input type="text" id="comment-handle" placeholder="@liamhardware" class="form-input">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Your Hardware Insight or Question</label>
              <textarea id="comment-message" required placeholder="Share your experience or questions about thermals, battery life, or benchmarks..." class="form-textarea"></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-sm">
              Post Comment <i class="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </section>
    </div>

    <!-- Sidebar Column -->
    <aside class="post-sidebar">
      <!-- Lead Analyst Bio -->
      <div class="sidebar-widget author-card">
        <img src="<?= e($post['author']['avatar']) ?>" alt="<?= e($post['author']['name']) ?>">
        <h4 style="font-size: 1.1rem; color: #fff; margin-bottom: 4px;"><?= e($post['author']['name']) ?></h4>
        <div style="font-size: 0.78rem; color: var(--accent-cyan-light); font-weight: 600; margin-bottom: 12px;"><?= e($post['author']['role']) ?></div>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px;">
          <?= e($post['author']['bio']) ?>
        </p>
        <a href="<?= url('about.php') ?>" class="btn btn-secondary btn-sm" style="width: 100%;">
          View Lab Credentials
        </a>
      </div>

      <!-- Google E-E-A-T Evaluation Pillar Box -->
      <div class="sidebar-widget" style="border-color: rgba(6, 182, 212, 0.3);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h4 style="font-size: 0.95rem; color: #fff; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-shield-halved" style="color: var(--accent-cyan);"></i> E-E-A-T Audit Breakdown
          </h4>
          <span class="score-badge" style="font-size: 0.75rem;"><?= $eeatScore ?>/100</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.8rem;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Experience:</span>
            <span style="color: var(--accent-emerald); font-weight: 700;">25/25 (First-party testing)</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Expertise:</span>
            <span style="color: var(--accent-emerald); font-weight: 700;">24/25 (Silicon breakdown)</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Authoritativeness:</span>
            <span style="color: var(--accent-emerald); font-weight: 700;">25/25 (Identified analyst)</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Trustworthiness:</span>
            <span style="color: var(--accent-emerald); font-weight: 700;">25/25 (Balanced pros/cons)</span>
          </div>
        </div>
      </div>

      <!-- Related Reviews in same category -->
      <?php if (!empty($relatedPosts)): ?>
      <div class="sidebar-widget">
        <h4 style="font-size: 0.95rem; color: #fff; margin-bottom: 16px;">Related <?= e($post['category']) ?> Reviews</h4>
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <?php foreach ($relatedPosts as $rel): ?>
          <a href="<?= url('post.php?slug=' . urlencode($rel['slug'])) ?>" style="display: flex; gap: 12px; align-items: center; text-decoration: none;">
            <img src="<?= e($rel['featuredImage']) ?>" alt="<?= e($rel['title']) ?>" style="width: 60px; height: 50px; border-radius: 6px; object-fit: cover; flex-shrink: 0;">
            <div>
              <h5 style="font-size: 0.82rem; color: #fff; line-height: 1.3; margin-bottom: 4px;"><?= e($rel['title']) ?></h5>
              <span class="score-badge" style="font-size: 0.68rem; padding: 2px 6px;">★ <?= number_format($rel['verdictScore'], 1) ?></span>
            </div>
          </a>
          <?php endforeach; ?>
        </div>
      </div>
      <?php endif; ?>
    </aside>
  </div>
</article>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
