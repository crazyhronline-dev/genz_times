<?php
/**
 * GenZ Time - Category Hub Page
 */

require_once __DIR__ . '/config/site.php';
require_once __DIR__ . '/includes/db-helper.php';

$slug = trim($_GET['slug'] ?? '');
if (empty($slug)) {
    header('Location: ' . url('blog.php'));
    exit;
}

$category = db_get_category_by_slug($slug);
if (!$category) {
    header('Location: ' . url('blog.php'));
    exit;
}

$pageTitle = $category['name'] . ' Reviews & Hardware Benchmarks | ' . SITE_NAME;
$pageDescription = 'Read comprehensive ' . strtolower($category['name']) . ' hardware reviews, benchmark teardowns, battery tests, and expert verdict from GenZ Time.';
$activeNav = $category['slug'];

$posts = db_get_all_posts(null, $category['slug']);

require_once __DIR__ . '/includes/header.php';
?>

<div class="container" style="padding: 40px 24px 64px;">
  <!-- Breadcrumb -->
  <nav style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--text-dim); margin-bottom: 24px;">
    <a href="<?= url('/') ?>">Home</a>
    <span>/</span>
    <a href="<?= url('blog.php') ?>">Reviews</a>
    <span>/</span>
    <span style="color: var(--accent-cyan-light);"><?= e($category['name']) ?></span>
  </nav>

  <!-- Category Banner -->
  <div style="background: linear-gradient(135deg, rgba(14, 21, 38, 0.9), rgba(10, 17, 32, 0.95)); border: 1px solid var(--border-cyan); border-radius: var(--radius-xl); padding: 40px; margin-bottom: 48px; box-shadow: var(--glow-cyan);">
    <div style="display: inline-block; background: rgba(6, 182, 212, 0.15); color: var(--accent-cyan-light); border: 1px solid var(--accent-cyan); padding: 4px 12px; border-radius: 9999px; font-size: 0.75rem; font-family: 'JetBrains Mono', monospace; font-weight: 700; margin-bottom: 16px;">
      HARDWARE TESTING VERTICAL
    </div>
    <h1 style="font-size: 2.8rem; margin-bottom: 14px; color: #fff;">
      <?= e($category['name']) ?>
    </h1>
    <p style="color: var(--text-muted); font-size: 1.1rem; max-width: 780px; line-height: 1.6;">
      <?= e($category['description']) ?>
    </p>
  </div>

  <!-- Category Posts Grid -->
  <div class="section-header">
    <h2 class="section-title">
      <i class="fa-solid fa-microchip section-title-cyan"></i> Tested <?= e($category['name']) ?> Devices (<?= count($posts) ?>)
    </h2>
    <a href="<?= url('blog.php') ?>" style="font-size: 0.85rem; color: var(--accent-cyan-light);">All Categories &rarr;</a>
  </div>

  <?php if (empty($posts)): ?>
  <div style="text-align: center; padding: 64px 20px; background: var(--bg-surface); border: 1px dashed var(--border-subtle); border-radius: var(--radius-lg);">
    <i class="fa-solid fa-microchip" style="font-size: 3rem; color: var(--text-dim); margin-bottom: 16px;"></i>
    <h3 style="font-size: 1.3rem; margin-bottom: 8px;">No reviews published in this category yet</h3>
    <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 20px;">Our hardware team is currently running lab benchmarks on new units.</p>
    <a href="<?= url('blog.php') ?>" class="btn btn-primary btn-sm">Explore Other Categories</a>
  </div>
  <?php else: ?>
  <div class="posts-grid">
    <?php foreach ($posts as $post): ?>
    <article class="post-card">
      <div class="post-card-thumb">
        <img src="<?= e($post['featuredImage']) ?>" alt="<?= e($post['title']) ?>" loading="lazy">
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
        <h3 class="post-card-title">
          <a href="<?= url('post.php?slug=' . urlencode($post['slug'])) ?>"><?= e($post['title']) ?></a>
        </h3>
        <p class="post-card-excerpt"><?= e($post['excerpt']) ?></p>
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
