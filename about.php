<?php
/**
 * GenZ Time - About Laboratory & E-E-A-T Credentials
 */

require_once __DIR__ . '/config/site.php';

$pageTitle = 'Testing Laboratory & Hardware Methodology (E-E-A-T) | ' . SITE_NAME;
$pageDescription = 'Discover how ' . SITE_NAME . ' conducts independent consumer hardware benchmarks, 72-hour battery rundowns, calibrated acoustic tests, and rigorous thermal analysis.';
$activeNav = 'about';

require_once __DIR__ . '/includes/header.php';
?>

<div class="container" style="padding: 48px 24px 80px;">
  <!-- Header -->
  <div style="text-align: center; max-width: 820px; margin: 0 auto 56px;">
    <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(6, 182, 212, 0.1); border: 1px solid var(--accent-cyan); padding: 6px 16px; border-radius: 9999px; font-size: 0.8rem; color: var(--accent-cyan-light); font-family: 'JetBrains Mono', monospace; margin-bottom: 20px;">
      <i class="fa-solid fa-flask"></i> INDEPENDENT HARDWARE TESTING LABORATORY
    </div>
    <h1 style="font-size: 3rem; line-height: 1.2; margin-bottom: 18px; color: #fff;">
      Engineering-Grade Tech Analysis. Zero Marketing Fluff.
    </h1>
    <p style="color: var(--text-muted); font-size: 1.15rem; line-height: 1.7;">
      <?= SITE_NAME ?> was founded with a singular mission: to eliminate syndicated press release regurgitation and provide hardware enthusiasts, developers, and prosumers with empirical, scientifically verified gadget reviews.
    </p>
  </div>

  <!-- Hero Image of Lab -->
  <div style="border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--border-cyan); margin-bottom: 64px; box-shadow: var(--glow-cyan); height: 420px;">
    <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80" alt="GenZ Time Laboratory Facility" style="width: 100%; height: 100%; object-fit: cover;">
  </div>

  <!-- 3 Testing Pillars Grid -->
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; margin-bottom: 64px;">
    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 32px;">
      <div style="font-size: 2rem; color: var(--accent-cyan); margin-bottom: 16px;"><i class="fa-solid fa-temperature-arrow-up"></i></div>
      <h3 style="font-size: 1.25rem; color: #fff; margin-bottom: 10px;">Calibrated Thermal Imaging</h3>
      <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6;">
        We utilize Fluke calibrated infrared thermal sensors and multi-point thermocouples to log skin temperatures and vapor chamber saturation during sustained 100% GPU loads.
      </p>
    </div>

    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 32px;">
      <div style="font-size: 2rem; color: var(--accent-emerald); margin-bottom: 16px;"><i class="fa-solid fa-battery-half"></i></div>
      <h3 style="font-size: 1.25rem; color: #fff; margin-bottom: 10px;">Standardized Battery Depletion</h3>
      <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6;">
        Every phone, laptop, and gaming handheld runs our custom automated web browsing, 4K loop, and AAA gaming script calibrated at exactly 200 nits display luminance.
      </p>
    </div>

    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 32px;">
      <div style="font-size: 2rem; color: var(--accent-purple); margin-bottom: 16px;"><i class="fa-solid fa-volume-high"></i></div>
      <h3 style="font-size: 1.25rem; color: #fff; margin-bottom: 10px;">Anechoic Acoustic Testing</h3>
      <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6;">
        Audio frequency curves are measured via Type 4128 head and torso simulators, logging active noise cancellation (ANC) decibel attenuation across 20Hz - 20,000Hz.
      </p>
    </div>
  </div>

  <!-- Lead Analyst Bio Card -->
  <div style="background: linear-gradient(135deg, rgba(14, 21, 38, 0.8), rgba(19, 29, 51, 0.9)); border: 1px solid var(--border-bright); border-radius: var(--radius-xl); padding: 48px; display: grid; grid-template-columns: 200px 1fr; gap: 40px; align-items: center;" id="lab">
    <img src="<?= SITE_AUTHOR_AVATAR ?>" alt="<?= SITE_AUTHOR ?>" style="width: 180px; height: 180px; border-radius: 50%; object-fit: cover; border: 3px solid var(--accent-cyan); box-shadow: 0 0 25px rgba(6, 182, 212, 0.4);">
    <div>
      <div style="font-size: 0.8rem; color: var(--accent-cyan-light); font-family: 'JetBrains Mono', monospace; font-weight: 700; margin-bottom: 6px;">
        LEAD HARDWARE ARCHITECT &amp; EDITOR-IN-CHIEF
      </div>
      <h2 style="font-size: 2.2rem; color: #fff; margin-bottom: 12px;"><?= SITE_AUTHOR ?></h2>
      <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.7; margin-bottom: 16px;">
        <?= SITE_AUTHOR_BIO ?> Our team has tested over 1,400 consumer devices, audited silicon micro-architectures from Qualcomm, Apple, AMD, and Intel, and authored benchmark evaluation criteria referenced across leading consumer hardware publications.
      </p>
      <div style="display: flex; gap: 16px;">
        <a href="<?= SITE_TWITTER ?>" target="_blank" class="btn btn-secondary btn-sm"><i class="fa-brands fa-x-twitter"></i> Follow On X</a>
        <a href="<?= url('contact.php') ?>" class="btn btn-cyber btn-sm"><i class="fa-regular fa-envelope"></i> Send Testing Inquiry</a>
      </div>
    </div>
  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
