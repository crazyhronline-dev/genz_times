<?php
/**
 * GenZ Time - Terms of Service
 */

require_once __DIR__ . '/config/site.php';

$pageTitle = 'Terms of Service | ' . SITE_NAME;
$pageDescription = 'Terms of service and usage conditions for ' . SITE_NAME . '.';
$activeNav = '';

require_once __DIR__ . '/includes/header.php';
?>

<div class="container" style="padding: 48px 24px 80px; max-width: 860px;">
  <h1 style="font-size: 2.8rem; color: #fff; margin-bottom: 24px;">Terms of Service</h1>
  <div class="post-article-content">
    <p>Last updated: <?= date('F j, Y') ?></p>
    <p>By accessing <?= SITE_NAME ?>, you agree to comply with these terms of service and all applicable laws and regulations.</p>
    <h2>1. Intellectual Property</h2>
    <p>All laboratory benchmark data, thermal graphs, custom silicon diagrams, and review texts on <?= SITE_NAME ?> are the exclusive intellectual property of <?= SITE_NAME ?>. Citations are permitted provided clear hyperlinked attribution is provided.</p>
    <h2>2. Disclaimer of Liability</h2>
    <p>Hardware testing results are generated in calibrated laboratory conditions. Variations in retail silicon batches may produce slight differences in individual consumer units.</p>
    <h2>3. Contact</h2>
    <p>For syndication rights or inquiries, email <a href="mailto:<?= SITE_CONTACT_EMAIL ?>"><?= SITE_CONTACT_EMAIL ?></a>.</p>
  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
