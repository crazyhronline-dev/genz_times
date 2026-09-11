<?php
/**
 * GenZ Time - Modern Tech Gadget Blog & Review Portal (Homepage)
 */

require_once __DIR__ . '/config/site.php';
require_once __DIR__ . '/includes/db-helper.php';

$pageTitle = SITE_NAME . ' — ' . SITE_TAGLINE;
$pageDescription = SITE_DESCRIPTION;
$activeNav = 'home';

// Fetch posts
$allPosts = db_get_all_posts();
$featuredPosts = db_get_featured_posts(1);
$leadPost = !empty($featuredPosts) ? $featuredPosts[0] : ($allPosts[0] ?? null);
$trendingPosts = db_get_trending_posts(4);
$categories = db_get_categories();

require_once __DIR__ . '/includes/header.php';
?>

<!-- Hero Section -->
<section class="hero-section">
  <div class="container hero-grid">
    <?php if ($leadPost): ?>
    <!-- Featured Flagship Review -->
    <article class="hero-featured-card">
      <div class="hero-img-wrap">
        <img src="<?= e($leadPost['featuredImage']) ?>" alt="<?= e($leadPost['title']) ?>" loading="eager">
        <div style="position: absolute; top: 16px; left: 16px; display: flex; gap: 8px;">
          <span class="category-tag"><?= e($leadPost['category']) ?></span>
          <span style="background: rgba(14, 165, 233, 0.9); color: #fff; font-size: 0.72rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.05em;">FLAGSHIP BENCHMARK</span>
        </div>
      </div>
      <div class="hero-featured-content">
        <div class="hero-badge-row">
          <div class="score-badge">
            <i class="fa-solid fa-bolt"></i> VERDICT: <?= number_format($leadPost['verdictScore'], 1) ?>/10
          </div>
          <span class="mono" style="font-size: 0.78rem; color: var(--text-dim);">
            <i class="fa-regular fa-clock"></i> <?= e($leadPost['readingTime']) ?>
          </span>
        </div>
        <h1 class="hero-title">
          <a href="<?= url('post.php?slug=' . urlencode($leadPost['slug'])) ?>"><?= e($leadPost['title']) ?></a>
        </h1>
        <p class="hero-excerpt"><?= e($leadPost['excerpt']) ?></p>
        <div style="margin-top: auto; display: flex; align-items: center; justify-content: space-between; pt: 16px;">
          <div class="author-pill">
            <img src="<?= e($leadPost['author']['avatar']) ?>" alt="<?= e($leadPost['author']['name']) ?>" class="author-avatar">
            <div>
              <div style="font-size: 0.82rem; font-weight: 600; color: #fff;"><?= e($leadPost['author']['name']) ?></div>
              <div style="font-size: 0.72rem; color: var(--text-dim);"><?= e($leadPost['author']['role']) ?></div>
            </div>
          </div>
          <a href="<?= url('post.php?slug=' . urlencode($leadPost['slug'])) ?>" class="btn btn-primary btn-sm">
            Read Full Review <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </article>
    <?php endif; ?>

    <!-- Trending Hardware Benchmarks Column -->
    <div class="trending-column">
      <div class="section-header" style="margin-bottom: 8px;">
        <h2 class="section-title">
          <i class="fa-solid fa-fire section-title-cyan"></i> Trending Hardware
        </h2>
        <a href="<?= url('blog.php') ?>" style="font-size: 0.82rem; color: var(--accent-cyan-light);">View Archive &rarr;</a>
      </div>

      <?php foreach ($trendingPosts as $trend): ?>
        <?php if ($leadPost && $trend['id'] === $leadPost['id']) continue; ?>
        <a href="<?= url('post.php?slug=' . urlencode($trend['slug'])) ?>" class="trending-item">
          <img src="<?= e($trend['featuredImage']) ?>" alt="<?= e($trend['title']) ?>" class="trending-thumb" loading="lazy">
          <div class="trending-info">
            <span class="category-tag" style="font-size: 0.65rem; padding: 2px 6px; margin-bottom: 6px;"><?= e($trend['category']) ?></span>
            <h4><?= e($trend['title']) ?></h4>
            <div class="trending-meta">
              <span class="score-badge" style="font-size: 0.7rem; padding: 2px 6px;">
                ★ <?= number_format($trend['verdictScore'], 1) ?>
              </span>
              <span><i class="fa-regular fa-eye"></i> <?= number_format($trend['views'] ?? 0) ?> reads</span>
            </div>
          </div>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- Hardware Categories Section -->
<section style="padding: 32px 0 48px;">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">
        <i class="fa-solid fa-layer-group section-title-cyan"></i> Explore Hardware Categories
      </h2>
      <span style="font-size: 0.85rem; color: var(--text-dim);">8 Specialized Testing Verticals</span>
    </div>

    <div class="category-grid">
      <?php 
      $iconMap = [
        'smartphones' => 'fa-mobile-screen',
        'laptops-computing' => 'fa-laptop-code',
        'audio-earbuds' => 'fa-headphones',
        'vr-wearables' => 'fa-vr-cardboard',
        'drones-cameras' => 'fa-camera-retro',
        'ai-gadgets' => 'fa-microchip',
        'gaming-gear' => 'fa-gamepad',
        'smart-home' => 'fa-house-signal'
      ];
      foreach ($categories as $cat): 
        $faIcon = $iconMap[$cat['slug']] ?? 'fa-cube';
      ?>
      <a href="<?= url('category.php?slug=' . urlencode($cat['slug'])) ?>" class="category-card">
        <div class="category-icon">
          <i class="fa-solid <?= $faIcon ?>"></i>
        </div>
        <h3><?= e($cat['name']) ?></h3>
        <p><?= e($cat['description']) ?></p>
        <span style="margin-top: auto; font-size: 0.78rem; color: var(--accent-cyan-light); font-weight: 600;">
          Explore <?= e($cat['name']) ?> &rarr;
        </span>
      </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- Latest In-Depth Reviews Section -->
<section style="padding: 20px 0 64px;">
  <div class="container">
    <div class="section-header">
      <div>
        <h2 class="section-title">
          <i class="fa-solid fa-microchip section-title-cyan"></i> Latest In-Depth Hardware Reviews
        </h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">
          Standardized 72-hour benchmark testing, acoustic decibels, and thermal teardowns.
        </p>
      </div>
      <a href="<?= url('blog.php') ?>" class="btn btn-secondary btn-sm">
        All <?= count($allPosts) ?> Reviews <i class="fa-solid fa-arrow-right"></i>
      </a>
    </div>

    <div class="posts-grid">
      <?php foreach (array_slice($allPosts, 0, 6) as $post): ?>
      <article class="post-card">
        <div class="post-card-thumb">
          <img src="<?= e($post['featuredImage']) ?>" alt="<?= e($post['title']) ?>" loading="lazy">
          <div style="position: absolute; top: 12px; left: 12px; display: flex; gap: 6px;">
            <span class="category-tag"><?= e($post['category']) ?></span>
          </div>
          <div style="position: absolute; bottom: 12px; right: 12px;">
            <span class="score-badge">
              <i class="fa-solid fa-star"></i> <?= number_format($post['verdictScore'], 1) ?>
            </span>
          </div>
        </div>
        <div class="post-card-content">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; font-size: 0.75rem; color: var(--text-dim);">
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
  </div>
</section>

<!-- E-E-A-T Testing Methodology Showcase -->
<section style="background: linear-gradient(180deg, rgba(14, 21, 38, 0.6) 0%, rgba(7, 11, 20, 0.9) 100%); padding: 64px 0; border-top: 1px solid var(--border-subtle);">
  <div class="container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center;">
    <div>
      <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(6, 182, 212, 0.1); border: 1px solid var(--accent-cyan); padding: 4px 12px; border-radius: 9999px; font-size: 0.75rem; color: var(--accent-cyan-light); font-family: 'JetBrains Mono', monospace; margin-bottom: 16px;">
        <i class="fa-solid fa-vial-circle-check"></i> GOOGLE E-E-A-T RIGOR
      </div>
      <h2 style="font-size: 2.2rem; line-height: 1.25; margin-bottom: 16px;">
        How <?= SITE_NAME ?> Tests Hardware Inside Our Dedicated Laboratory
      </h2>
      <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.7; margin-bottom: 20px;">
        Unlike superficial unboxing content, every gadget reviewed on <?= SITE_NAME ?> endures 72 hours of uninterrupted stress testing. We measure peak thermal wattages with Fluke infrared sensors, log battery drain down to the milliamp-hour, and benchmark silicon sustained clocks.
      </p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 14px; border-radius: 8px;">
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent-cyan); font-family: 'Space Grotesk';">72h+</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Sustained Benchmarks</div>
        </div>
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 14px; border-radius: 8px;">
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent-emerald); font-family: 'Space Grotesk';">100%</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Independent Lab Units</div>
        </div>
      </div>
      <a href="<?= url('about.php') ?>" class="btn btn-cyber">
        Read Our Testing Standards & E-E-A-T Policy <i class="fa-solid fa-arrow-right"></i>
      </a>
    </div>
    <div style="position: relative;">
      <div style="border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--border-cyan); box-shadow: var(--glow-cyan);">
        <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80" alt="GenZ Time Hardware Testing Lab" style="width: 100%; height: 380px; object-fit: cover; display: block;">
      </div>
    </div>
  </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
