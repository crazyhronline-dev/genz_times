<?php
/**
 * GenZ Time - Privacy Policy
 */

require_once __DIR__ . '/config/site.php';

$pageTitle = 'Privacy Policy | ' . SITE_NAME;
$pageDescription = 'Privacy Policy for ' . SITE_NAME . ' readers and subscribers.';
$activeNav = '';

require_once __DIR__ . '/includes/header.php';
?>

<div class="container" style="padding: 48px 24px 80px; max-width: 860px;">
  <h1 style="font-size: 2.8rem; color: #fff; margin-bottom: 24px;">Privacy Policy</h1>
  <div class="post-article-content">
    <p>Last updated: <?= date('F j, Y') ?></p>
    <p><?= SITE_NAME ?> ("we", "our", or "us") respects your privacy. This Privacy Policy explains our practices regarding data collection and usage on our hardware review portal.</p>
    <h2>1. Information We Collect</h2>
    <p>We do not require account registration to read our reviews and benchmarks. When you subscribe to our newsletter or comment on a review, we collect the email address or display name you voluntarily provide.</p>
    <h2>2. Analytics & Cookies</h2>
    <p>We use lightweight, privacy-focused analytics to understand visitor demographics and popular hardware benchmarks. We do not sell personal data to third parties.</p>
    <h2>3. Contact Us</h2>
    <p>If you have any questions regarding our privacy practices, please contact us at <a href="mailto:<?= SITE_CONTACT_EMAIL ?>"><?= SITE_CONTACT_EMAIL ?></a>.</p>
  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
