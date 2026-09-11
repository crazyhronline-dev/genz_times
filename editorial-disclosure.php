<?php
/**
 * GenZ Time - Editorial Standards & Disclosure
 */

require_once __DIR__ . '/config/site.php';

$pageTitle = 'Editorial Standards & Commercial Disclosure | ' . SITE_NAME;
$pageDescription = 'Our independent testing ethics, review unit handling protocols, affiliate transparency, and Google E-E-A-T editorial compliance.';
$activeNav = 'editorial';

require_once __DIR__ . '/includes/header.php';
?>

<div class="container" style="padding: 48px 24px 80px; max-width: 860px;">
  <nav style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--text-dim); margin-bottom: 24px;">
    <a href="<?= url('/') ?>">Home</a>
    <span>/</span>
    <span style="color: var(--accent-cyan-light);">Editorial Disclosure</span>
  </nav>

  <h1 style="font-size: 2.8rem; color: #fff; margin-bottom: 24px;">Editorial Standards &amp; Disclosure</h1>

  <div class="post-article-content">
    <p>
      At <strong><?= SITE_NAME ?></strong>, credibility and empirical integrity are the bedrock of our journalism. We believe hardware enthusiasts deserve transparent, uncompromised reporting that accurately depicts how devices perform under real-world and sustained stress conditions.
    </p>

    <h2>1. 100% Editorial Independence</h2>
    <p>
      Our editorial decisions are entirely independent of commercial interests, advertisers, and hardware manufacturers. No company can pay for a higher verdict score, a favorable review, or guaranteed placement on our flagship spotlight. If a product fails our battery runtime tests or exhibits thermal throttling, those findings are documented truthfully.
    </p>

    <h2>2. Handling of Review Units</h2>
    <p>
      We acquire products for review through two primary avenues:
    </p>
    <ul>
      <li><strong>Retail Purchases:</strong> The majority of hardware evaluated in our lab is purchased anonymously through standard retail channels to ensure our test units mirror the silicon lottery experienced by real consumers.</li>
      <li><strong>Loaner Evaluation Units:</strong> When provided by manufacturers, loaner hardware is accepted with the explicit condition that <?= SITE_NAME ?> retains 100% editorial freedom. Loaner devices are returned following the conclusion of our 72-hour benchmark cycle.</li>
    </ul>

    <h2>3. Commercial & Affiliate Transparency</h2>
    <p>
      <?= SITE_NAME ?> may earn an affiliate commission when readers make purchases through links on our site. These links do not influence our scores or opinions. We recommend products based solely on lab-tested merits, whether or not an affiliate program exists.
    </p>

    <h2>4. Google E-E-A-T Commitment</h2>
    <p>
      In accordance with Google's Quality Rater Guidelines for Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T), every piece published on <?= SITE_NAME ?> is authored or supervised by credentialed hardware analysts with demonstrable technical domain experience.
    </p>
  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
