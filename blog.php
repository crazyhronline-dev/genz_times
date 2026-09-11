<?php
/**
 * GenZ Time - Hardware Reviews & Articles Archive
 */

require_once __DIR__ . '/config/site.php';
require_once __DIR__ . '/includes/db-helper.php';

$searchQuery = trim($_GET['search'] ?? '');
$categorySlug = trim($_GET['category'] ?? '');

$pageTitle = 'All Hardware Reviews & Lab Benchmarks | ' . SITE_NAME;
$pageDescription = 'Browse all tech gadget reviews, hardware benchmarks, and laboratory testing logs across smartphones, laptops, audio, spatial computing, and AI gadgets.';
$activeNav = 'reviews';

$allPosts = db_get_all_posts(null, $categorySlug ?: null, $searchQuery ?: null);
$categories = db_get_categories();

require_once __DIR__ . '/includes/header.php';
?>

<div class="container" style="padding: 40px 24px 64px;">
  <!-- Breadcrumb -->
  <nav style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--text-dim); margin-bottom: 24px;">
    <a href="<?= url('/') ?>">Home</a>
    <span>/</span>
    <span style="color: var(--accent-cyan-light);">Hardware Reviews Archive</span>
  </nav>

  <!-- Page Header -->
  <div style="margin-bottom: 36px;">
    <h1 style="font-size: 2.6rem; margin-bottom: 12px; color: #fff;">
      Hardware Reviews &amp; Lab Benchmarks
    </h1>
    <p style="color: var(--text-muted); font-size: 1.05rem; max-width: 760px;">
      Explore our comprehensive database of consumer tech hardware evaluations, tested with calibrated tools and measured against strict E-E-A-T standards.
    </p>
  </div>

  <!-- Search & Category Filter Toolbar -->
  <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 36px; display: flex; flex-direction: column; gap: 16px;">
    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
      <div style="flex: 1; min-width: 260px; position: relative;">
        <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-dim);"></i>
        <input type="text" id="archive-search" value="<?= e($searchQuery) ?>" placeholder="Search by gadget name, processor, specs (e.g. M4, 80Wh, OLED)..." class="form-input" style="padding-left: 44px;">
      </div>
      <div>
        <a href="<?= url('blog.php') ?>" class="btn btn-secondary" style="font-size: 0.85rem;">Clear Filters</a>
      </div>
    </div>

    <!-- Category Filter Pills -->
    <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center; pt: 8px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
      <span style="font-size: 0.78rem; color: var(--text-dim); font-weight: 600; margin-right: 4px;">CATEGORY:</span>
      <a href="<?= url('blog.php') ?>" class="btn btn-sm <?= empty($categorySlug) ? 'btn-primary' : 'btn-secondary' ?>">All</a>
      <?php foreach ($categories as $cat): ?>
      <a href="<?= url('blog.php?category=' . urlencode($cat['slug'])) ?>" class="btn btn-sm <?= $categorySlug === $cat['slug'] ? 'btn-primary' : 'btn-secondary' ?>">
        <?= e($cat['name']) ?>
      </a>
      <?php endforeach; ?>
    </div>
  </div>

  <!-- Results Count -->
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
    <div style="font-size: 0.9rem; color: var(--text-muted);">
      Showing <strong style="color: #fff;"><?= count($allPosts) ?></strong> hardware reviews
      <?php if (!empty($categorySlug)): ?> in <span style="color: var(--accent-cyan); font-weight: 600;"><?= e($categorySlug) ?></span><?php endif; ?>
      <?php if (!empty($searchQuery)): ?> matching "<span style="color: var(--accent-cyan);"><?= e($searchQuery) ?></span>"<?php endif; ?>
    </div>
  </div>

  <?php if (empty($allPosts)): ?>
  <div style="text-align: center; padding: 64px 20px; background: var(--bg-surface); border: 1px dashed var(--border-subtle); border-radius: var(--radius-lg);">
    <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; color: var(--text-dim); margin-bottom: 16px;"></i>
    <h3 style="font-size: 1.3rem; margin-bottom: 8px;">No hardware reviews found</h3>
    <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 20px;">Try adjusting your search terms or view all categories.</p>
    <a href="<?= url('blog.php') ?>" class="btn btn-primary btn-sm">Reset All Filters</a>
  </div>
  <?php else: ?>
  <div class="posts-grid">
    <?php foreach ($allPosts as $post): ?>
    <article class="post-card archive-post-card" 
             data-title="<?= e($post['title']) ?>" 
             data-category="<?= e($post['category']) ?>" 
             data-excerpt="<?= e($post['excerpt']) ?>">
      <div class="post-card-thumb">
        <img src="<?= e($post['featuredImage']) ?>" alt="<?= e($post['title']) ?>" loading="lazy">
        <div style="position: absolute; top: 12px; left: 12px; display: flex; gap: 6px;">
          <span class="category-tag"><?= e($post['category']) ?></span>
        </div>
        <div style="position: absolute; bottom: 12px; right: 12px;">
          <span class="score-badge">
            <i class="fa-solid fa-bolt"></i> <?= number_format($post['verdictScore'], 1) ?>
          </span>
        </div>
      </div>
      <div class="post-card-content">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; font-size: 0.75rem; color: var(--text-dim);">
          <span class="mono"><i class="fa-regular fa-calendar"></i> <?= date('M d, Y', strtotime($post['publishedAt'])) ?></span>
          <span class="mono"><i class="fa-regular fa-clock"></i> <?= e($post['readingTime']) ?></span>
        </div>
        <h2 class="post-card-title" style="font-size: 1.15rem;">
          <a href="<?= url('post.php?slug=' . urlencode($post['slug'])) ?>"><?= e($post['title']) ?></a>
        </h2>
        <p class="post-card-excerpt"><?= e($post['excerpt']) ?></p>

        <!-- Tags preview -->
        <?php if (!empty($post['tags'])): ?>
        <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 16px;">
          <?php foreach (array_slice($post['tags'], 0, 3) as $t): ?>
          <span style="background: rgba(255,255,255,0.04); color: var(--text-muted); font-size: 0.68rem; padding: 2px 6px; border-radius: 4px;">#<?= e($t) ?></span>
          <?php endforeach; ?>
        </div>
        <?php endif; ?>

        <div class="post-card-footer">
          <div class="author-pill">
            <img src="<?= e($post['author']['avatar']) ?>" alt="<?= e($post['author']['name']) ?>" class="author-avatar">
            <span><?= e($post['author']['name']) ?></span>
          </div>
          <a href="<?= url('post.php?slug=' . urlencode($post['slug'])) ?>" style="font-weight: 600; color: var(--accent-cyan-light); font-size: 0.8rem;">
            Full Review &rarr;
          </a>
        </div>
      </div>
    </article>
    <?php endforeach; ?>
  </div>
  <?php endif; ?>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
