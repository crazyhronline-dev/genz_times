<?php
/**
 * GenZ Time - 1-Click MySQL Database Installer
 * Designed for Shared Hosting (cPanel / Hostinger) and Localhost setup.
 */

require_once __DIR__ . '/config/site.php';

$message = '';
$status = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dbHost = trim($_POST['db_host'] ?? '127.0.0.1');
    $dbPort = trim($_POST['db_port'] ?? '3306');
    $dbName = trim($_POST['db_name'] ?? 'genz_time');
    $dbUser = trim($_POST['db_user'] ?? 'root');
    $dbPass = $_POST['db_pass'] ?? '';

    try {
        // Step 1: Connect to MySQL Server (attempt connecting directly to database, works best on Hostinger & cPanel)
        try {
            $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
            $pdo = new PDO($dsn, $dbUser, $dbPass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_TIMEOUT => 5
            ]);
        } catch (PDOException $eDb) {
            // If db doesn't exist yet, connect to server and create it (localhost / root mode)
            $dsn = "mysql:host={$dbHost};port={$dbPort};charset=utf8mb4";
            $pdo = new PDO($dsn, $dbUser, $dbPass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_TIMEOUT => 5
            ]);
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            $pdo->exec("USE `{$dbName}`");
        }

        // Step 3: Run database.sql schema
        $sqlFile = __DIR__ . '/database.sql';
        if (file_exists($sqlFile)) {
            $sqlContent = file_get_contents($sqlFile);
            $queries = explode(';', $sqlContent);
            foreach ($queries as $q) {
                $q = trim($q);
                if (!empty($q)) {
                    $pdo->exec($q);
                }
            }
        }

        // Step 4: Import all 7 seed reviews from data/posts.json into posts table
        $jsonFile = __DIR__ . '/data/posts.json';
        $importedCount = 0;
        if (file_exists($jsonFile)) {
            $postsData = json_decode(file_get_contents($jsonFile), true);
            if (is_array($postsData)) {
                $stmt = $pdo->prepare("INSERT INTO posts (
                    id, title, slug, excerpt, content, featured_image,
                    category_id, category_name, category_slug, tags,
                    author_name, author_role, author_avatar, author_bio,
                    published_at, reading_time, verdict_score, verdict_summary,
                    pros, cons, specs, meta_title, meta_description,
                    focus_keyword, canonical_url, eeat_score, originality_score,
                    is_featured, is_trending, views
                ) VALUES (
                    :id, :title, :slug, :excerpt, :content, :featured_image,
                    :category_id, :category_name, :category_slug, :tags,
                    :author_name, :author_role, :author_avatar, :author_bio,
                    :published_at, :reading_time, :verdict_score, :verdict_summary,
                    :pros, :cons, :specs, :meta_title, :meta_description,
                    :focus_keyword, :canonical_url, :eeat_score, :originality_score,
                    :is_featured, :is_trending, :views
                ) ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content)");

                foreach ($postsData as $p) {
                    $now = date('Y-m-d H:i:s');
                    $pubAt = isset($p['publishedAt']) ? date('Y-m-d H:i:s', strtotime($p['publishedAt'])) : $now;
                    
                    $stmt->execute([
                        ':id'               => $p['id'] ?? ('post-' . uniqid()),
                        ':title'            => $p['title'] ?? '',
                        ':slug'             => $p['slug'] ?? '',
                        ':excerpt'          => $p['excerpt'] ?? '',
                        ':content'          => $p['content'] ?? '',
                        ':featured_image'   => $p['featuredImage'] ?? '',
                        ':category_id'      => 1,
                        ':category_name'    => $p['category'] ?? 'Smartphones',
                        ':category_slug'    => $p['categorySlug'] ?? 'smartphones',
                        ':tags'             => json_encode($p['tags'] ?? []),
                        ':author_name'      => $p['author']['name'] ?? SITE_AUTHOR,
                        ':author_role'      => $p['author']['role'] ?? SITE_AUTHOR_ROLE,
                        ':author_avatar'    => $p['author']['avatar'] ?? SITE_AUTHOR_AVATAR,
                        ':author_bio'       => $p['author']['bio'] ?? SITE_AUTHOR_BIO,
                        ':published_at'     => $pubAt,
                        ':reading_time'     => $p['readingTime'] ?? '5 min read',
                        ':verdict_score'    => (float)($p['verdictScore'] ?? 9.0),
                        ':verdict_summary'  => $p['verdictSummary'] ?? '',
                        ':pros'             => json_encode($p['pros'] ?? []),
                        ':cons'             => json_encode($p['cons'] ?? []),
                        ':specs'            => json_encode($p['specs'] ?? []),
                        ':meta_title'       => $p['seo']['metaTitle'] ?? $p['title'],
                        ':meta_description' => $p['seo']['metaDescription'] ?? $p['excerpt'],
                        ':focus_keyword'    => $p['seo']['focusKeyword'] ?? '',
                        ':canonical_url'    => $p['seo']['canonicalUrl'] ?? '',
                        ':eeat_score'       => (int)($p['eeatScore'] ?? 92),
                        ':originality_score'=> (int)($p['originalityScore'] ?? 98),
                        ':is_featured'      => !empty($p['isFeatured']) ? 1 : 0,
                        ':is_trending'      => !empty($p['isTrending']) ? 1 : 0,
                        ':views'            => (int)($p['views'] ?? 100)
                    ]);
                    $importedCount++;
                }
            }
        }

        // Step 5: Update config/site.php or config constants with provided DB details
        $siteConfigFile = __DIR__ . '/config/site.php';
        $siteConfig = file_get_contents($siteConfigFile);
        $siteConfig = preg_replace("/define\('DB_HOST',.*?\);/", "define('DB_HOST', '{$dbHost}');", $siteConfig);
        $siteConfig = preg_replace("/define\('DB_PORT',.*?\);/", "define('DB_PORT', '{$dbPort}');", $siteConfig);
        $siteConfig = preg_replace("/define\('DB_NAME',.*?\);/", "define('DB_NAME', '{$dbName}');", $siteConfig);
        $siteConfig = preg_replace("/define\('DB_USER',.*?\);/", "define('DB_USER', '{$dbUser}');", $siteConfig);
        $siteConfig = preg_replace("/define\('DB_PASS',.*?\);/", "define('DB_PASS', '" . addslashes($dbPass) . "');", $siteConfig);
        file_put_contents($siteConfigFile, $siteConfig);

        $status = 'success';
        $message = "Installation Successful! Connected to MySQL, created database '{$dbName}', installed tables (categories, posts, admins, comments), and populated {$importedCount} hardware reviews.";
    } catch (PDOException $e) {
        $status = 'error';
        $message = "Database Connection Failed: " . $e->getMessage() . ". (Please verify that your MySQL server is running and credentials are valid).";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MySQL Database Installer — <?= SITE_NAME ?></title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px;">

  <div style="width: 100%; max-width: 580px; background: var(--bg-surface); border: 1px solid var(--border-cyan); border-radius: var(--radius-xl); padding: 40px; box-shadow: var(--glow-cyan);">
    
    <div style="text-align: center; margin-bottom: 28px;">
      <?php require_once __DIR__ . '/includes/logo.php'; echo render_logo('lg', true, false); ?>
      <h2 style="font-size: 1.6rem; color: #fff; margin-top: 16px;">1-Click MySQL Installer</h2>
      <p style="color: var(--text-muted); font-size: 0.88rem; margin-top: 6px;">
        Designed for Shared Hosting (cPanel / phpMyAdmin / Hostinger) and Localhost.
      </p>
    </div>

    <?php if ($status === 'success'): ?>
      <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--accent-emerald); color: #34D399; padding: 16px; border-radius: 8px; margin-bottom: 24px; font-size: 0.9rem;">
        <i class="fa-solid fa-circle-check"></i> <?= e($message) ?>
      </div>
      <div style="display: flex; gap: 12px;">
        <a href="<?= url('admin/index.php') ?>" class="btn btn-primary" style="flex: 1;">Go to Admin Portal</a>
        <a href="<?= url('/') ?>" class="btn btn-secondary" style="flex: 1;">View Homepage</a>
      </div>
    <?php else: ?>

      <?php if ($status === 'error'): ?>
      <div style="background: rgba(244, 63, 94, 0.1); border: 1px solid var(--accent-rose); color: #FB7185; padding: 14px; border-radius: 8px; margin-bottom: 20px; font-size: 0.85rem;">
        <i class="fa-solid fa-triangle-exclamation"></i> <?= e($message) ?>
      </div>
      <?php endif; ?>

      <form method="POST">
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px;">
          <div class="form-group">
            <label class="form-label">MySQL Host</label>
            <input type="text" name="db_host" value="<?= e($_POST['db_host'] ?? DB_HOST) ?>" required class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">Port</label>
            <input type="text" name="db_port" value="<?= e($_POST['db_port'] ?? DB_PORT) ?>" required class="form-input">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Database Name</label>
          <input type="text" name="db_name" value="<?= e($_POST['db_name'] ?? DB_NAME) ?>" required class="form-input">
          <small style="color: var(--text-dim); font-size: 0.75rem;">Will be created automatically if not yet existing.</small>
        </div>

        <div class="form-group">
          <label class="form-label">MySQL Username</label>
          <input type="text" name="db_user" value="<?= e($_POST['db_user'] ?? DB_USER) ?>" required class="form-input">
        </div>

        <div class="form-group">
          <label class="form-label">MySQL Password</label>
          <input type="password" name="db_pass" value="<?= e($_POST['db_pass'] ?? DB_PASS) ?>" placeholder="Leave blank if no password" class="form-input">
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 1rem; margin-top: 8px;">
          <i class="fa-solid fa-database"></i> Install &amp; Seed Database
        </button>
      </form>

      <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-subtle); text-align: center;">
        <p style="color: var(--text-dim); font-size: 0.8rem; margin-bottom: 8px;">
          💡 <strong>Resilience Mode:</strong> <?= SITE_NAME ?> already functions immediately via its built-in fallback store.
        </p>
        <a href="<?= url('/') ?>" style="color: var(--accent-cyan); font-size: 0.85rem;">Skip and enter website directly &rarr;</a>
      </div>
    <?php endif; ?>

  </div>

</body>
</html>
