<?php
/**
 * GenZ Time - Contact & Review Pitches
 */

require_once __DIR__ . '/config/site.php';

$pageTitle = 'Contact & Pitch Hardware Review Units | ' . SITE_NAME;
$pageDescription = 'Contact the ' . SITE_NAME . ' editorial hardware laboratory. Submit review units, technical benchmark inquiries, or editorial corrections.';
$activeNav = 'contact';

require_once __DIR__ . '/includes/header.php';
?>

<div class="container" style="padding: 48px 24px 80px; max-width: 960px;">
  <!-- Breadcrumb -->
  <nav style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--text-dim); margin-bottom: 24px;">
    <a href="<?= url('/') ?>">Home</a>
    <span>/</span>
    <span style="color: var(--accent-cyan-light);">Contact &amp; Pitches</span>
  </nav>

  <div style="margin-bottom: 40px;">
    <h1 style="font-size: 2.8rem; color: #fff; margin-bottom: 12px;">Contact <?= SITE_NAME ?> Lab</h1>
    <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
      Have a cutting-edge gadget, new custom silicon device, or benchmark testing inquiry? Reach our hardware analysts directly below.
    </p>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1.3fr; gap: 40px;">
    <!-- Contact Info Cards -->
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 24px;">
        <div style="color: var(--accent-cyan); font-size: 1.5rem; margin-bottom: 12px;"><i class="fa-solid fa-envelope"></i></div>
        <h3 style="font-size: 1.1rem; color: #fff; margin-bottom: 6px;">Editorial Lab Email</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 8px;">Direct line to our testing workbench:</p>
        <a href="mailto:<?= SITE_CONTACT_EMAIL ?>" style="color: var(--accent-cyan-light); font-weight: 600;"><?= SITE_CONTACT_EMAIL ?></a>
      </div>

      <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 24px;">
        <div style="color: var(--accent-purple); font-size: 1.5rem; margin-bottom: 12px;"><i class="fa-solid fa-box-open"></i></div>
        <h3 style="font-size: 1.1rem; color: #fff; margin-bottom: 6px;">Review Unit Submissions</h3>
        <p style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.5;">
          Hardware manufacturers seeking benchmark inclusion must adhere to our strict independent testing protocols. We do not accept paid score manipulation or pre-cleared editorial copy.
        </p>
      </div>

      <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 24px;">
        <div style="color: var(--accent-emerald); font-size: 1.5rem; margin-bottom: 12px;"><i class="fa-solid fa-shield-halved"></i></div>
        <h3 style="font-size: 1.1rem; color: #fff; margin-bottom: 6px;">Editorial Ethics &amp; E-E-A-T</h3>
        <p style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.5;">
          Read our comprehensive <a href="<?= url('editorial-disclosure.php') ?>" style="color: var(--accent-cyan);">Editorial Disclosure</a> regarding how products are sourced and tested.
        </p>
      </div>
    </div>

    <!-- Contact Form -->
    <div style="background: var(--bg-surface); border: 1px solid var(--border-bright); border-radius: var(--radius-lg); padding: 32px;">
      <h3 style="font-size: 1.35rem; color: #fff; margin-bottom: 20px;">Send Hardware Pitch or Inquiry</h3>
      <form onsubmit="event.preventDefault(); alert('Message successfully transmitted to <?= SITE_NAME ?> Editorial Lab!'); this.reset();">
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" required placeholder="e.g. Elena Rostova" class="form-input">
        </div>
        <div class="form-group">
          <label class="form-label">Corporate or Personal Email</label>
          <input type="email" required placeholder="name@company.com" class="form-input">
        </div>
        <div class="form-group">
          <label class="form-label">Topic / Hardware Category</label>
          <select class="form-select">
            <option>Pitching a Review Unit / Hardware Sample</option>
            <option>Benchmark Methodology Inquiry</option>
            <option>Editorial Correction / Update</option>
            <option>General Tech Question</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Message Details</label>
          <textarea required placeholder="Include hardware specifications, release schedule, or lab questions..." class="form-textarea" style="min-height: 140px;"></textarea>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">
          Submit Inquiry to Lab <i class="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
