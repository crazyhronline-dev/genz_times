<?php
/**
 * GenZ Time - Admin CMS Header Component
 */

require_once __DIR__ . '/../config/site.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../includes/logo.php';

require_admin_auth();

$adminNav = $adminNav ?? 'dashboard';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title><?= e($adminTitle ?? 'Admin CMS') ?> — <?= SITE_NAME ?> Studio</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="<?= asset('assets/css/style.css') ?>">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body style="background: #070B14; color: #F1F5F9;">

  <!-- Admin Top Navigation -->
  <header style="background: rgba(14, 21, 38, 0.9); border-bottom: 1px solid var(--border-subtle); position: sticky; top: 0; z-index: 100; backdrop-filter: blur(12px);">
    <div class="container" style="display: flex; align-items: center; justify-content: space-between; height: 70px;">
      <div style="display: flex; align-items: center; gap: 24px;">
        <?= render_logo('sm', true, true) ?>
        <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent-cyan-light); border: 1px solid var(--accent-cyan); padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-family: 'JetBrains Mono', monospace; font-weight: 700;">
          LAB CMS v2.0
        </span>
      </div>

      <nav style="display: flex; align-items: center; gap: 20px;">
        <a href="<?= url('admin/index.php') ?>" class="nav-link <?= $adminNav === 'dashboard' ? 'active' : '' ?>">
          <i class="fa-solid fa-gauge"></i> Dashboard
        </a>
        <a href="<?= url('admin/publish.php') ?>" class="nav-link <?= $adminNav === 'publish' ? 'active' : '' ?>">
          <i class="fa-solid fa-plus"></i> New Hardware Review
        </a>
        <a href="<?= url('/') ?>" target="_blank" class="nav-link">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Site
        </a>
        <a href="<?= url('admin/logout.php') ?>" class="btn btn-secondary btn-sm" style="color: #FB7185; border-color: rgba(244, 63, 94, 0.3);">
          <i class="fa-solid fa-right-from-bracket"></i> Logout
        </a>
      </nav>
    </div>
  </header>

  <main style="padding: 32px 0 64px;">
