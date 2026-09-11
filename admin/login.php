<?php
/**
 * GenZ Time - Admin CMS Login Portal
 */

require_once __DIR__ . '/../config/site.php';
require_once __DIR__ . '/../includes/db-helper.php';
require_once __DIR__ . '/auth.php';

if (is_admin_logged_in()) {
    header('Location: ' . url('admin/index.php'));
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if (db_verify_admin($username, $password)) {
        $_SESSION['genz_admin_logged_in'] = true;
        $_SESSION['admin_user'] = $username;
        $_SESSION['admin_name'] = 'GenZ Editorial Team';
        header('Location: ' . url('admin/index.php'));
        exit;
    } else {
        $error = 'Invalid administrative credentials. Please verify username and password.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Admin CMS Portal — <?= SITE_NAME ?></title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="<?= asset('assets/css/style.css') ?>">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px;">

  <div style="width: 100%; max-width: 440px; background: var(--bg-surface); border: 1px solid var(--border-cyan); border-radius: var(--radius-xl); padding: 40px; box-shadow: var(--glow-cyan);">
    
    <div style="text-align: center; margin-bottom: 32px;">
      <?php require_once __DIR__ . '/../includes/logo.php'; echo render_logo('md', true, false); ?>
      <h2 style="font-size: 1.5rem; color: #fff; margin-top: 20px;">Admin CMS Portal</h2>
      <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">Enter credentials to access hardware review publishing suite.</p>
    </div>

    <?php if ($error): ?>
    <div style="background: rgba(244, 63, 94, 0.1); border: 1px solid var(--accent-rose); color: #FB7185; padding: 12px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 20px;">
      <i class="fa-solid fa-triangle-exclamation"></i> <?= e($error) ?>
    </div>
    <?php endif; ?>

    <form method="POST">
      <div class="form-group">
        <label class="form-label">Username</label>
        <input type="text" name="username" value="admin" required class="form-input">
      </div>

      <div class="form-group">
        <label class="form-label">Password</label>
        <input type="password" name="password" value="genztime2026" required class="form-input">
      </div>

      <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 0.95rem; margin-top: 8px;">
        <i class="fa-solid fa-lock-open"></i> Authenticate &amp; Access CMS
      </button>
    </form>

    <div style="background: rgba(6, 182, 212, 0.08); border: 1px dashed rgba(6, 182, 212, 0.3); border-radius: 8px; padding: 14px; margin-top: 24px; font-size: 0.78rem; color: var(--text-dim);">
      <strong style="color: var(--accent-cyan-light);"><i class="fa-solid fa-key"></i> Default Access:</strong><br>
      Username: <code style="color: #fff;">admin</code><br>
      Password: <code style="color: #fff;">genztime2026</code> (or <code>genztime2026</code>)
    </div>

    <div style="text-align: center; margin-top: 24px;">
      <a href="<?= url('/') ?>" style="font-size: 0.82rem; color: var(--text-muted);">&larr; Return to Public Website</a>
    </div>

  </div>

</body>
</html>
