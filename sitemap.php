<?php
/**
 * GenZ Time - Dynamic XML Sitemap
 * Automatically generates Google-compliant sitemap XML for all posts, categories, and pages.
 */

require_once __DIR__ . '/config/site.php';
require_once __DIR__ . '/includes/db-helper.php';

header('Content-Type: application/xml; charset=utf-8');

$posts = db_get_all_posts();
$categories = db_get_categories();

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Core Pages -->
  <url>
    <loc><?= BASE_URL ?>/</loc>
    <lastmod><?= date('Y-m-d') ?></lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc><?= BASE_URL ?>/blog.php</loc>
    <lastmod><?= date('Y-m-d') ?></lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc><?= BASE_URL ?>/about.php</loc>
    <lastmod><?= date('Y-m-d') ?></lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc><?= BASE_URL ?>/contact.php</loc>
    <lastmod><?= date('Y-m-d') ?></lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc><?= BASE_URL ?>/editorial-disclosure.php</loc>
    <lastmod><?= date('Y-m-d') ?></lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Categories -->
  <?php foreach ($categories as $cat): ?>
  <url>
    <loc><?= BASE_URL ?>/category.php?slug=<?= urlencode($cat['slug']) ?></loc>
    <lastmod><?= date('Y-m-d') ?></lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <?php endforeach; ?>

  <!-- In-Depth Hardware Review Posts -->
  <?php foreach ($posts as $p): ?>
  <url>
    <loc><?= BASE_URL ?>/post.php?slug=<?= urlencode($p['slug']) ?></loc>
    <lastmod><?= date('Y-m-d', strtotime($p['updatedAt'] ?? $p['publishedAt'] ?? 'now')) ?></lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <?php endforeach; ?>
</urlset>
