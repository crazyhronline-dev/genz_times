  </main>

  <!-- 4 Google E-E-A-T Trust Pillars -->
  <section class="trust-pillars">
    <div class="container pillars-grid">
      <div class="pillar-item">
        <div class="pillar-icon"><i class="fa-solid fa-microchip"></i></div>
        <div>
          <h4 class="pillar-title">100% Independent Testing</h4>
          <p class="pillar-desc">Retail-purchased hardware units tested with zero manufacturer sponsorship or bias.</p>
        </div>
      </div>
      <div class="pillar-item">
        <div class="pillar-icon"><i class="fa-solid fa-chart-line"></i></div>
        <div>
          <h4 class="pillar-title">Real Empirical Benchmarks</h4>
          <p class="pillar-desc">Calibrated thermal probes, 72-hour battery rundowns, and repeatable stress logs.</p>
        </div>
      </div>
      <div class="pillar-item">
        <div class="pillar-icon"><i class="fa-solid fa-shield-halved"></i></div>
        <div>
          <h4 class="pillar-title">E-E-A-T High Standards</h4>
          <p class="pillar-desc">Strict adherence to Google Search Quality Rater guidelines & rigorous methodology.</p>
        </div>
      </div>
      <div class="pillar-item">
        <div class="pillar-icon"><i class="fa-solid fa-award"></i></div>
        <div>
          <h4 class="pillar-title">Uncompromising Verdicts</h4>
          <p class="pillar-desc">Objective numeric grading system identifying genuine flaws without corporate sugarcoating.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <!-- Col 1: Brand Info -->
        <div class="footer-col">
          <div style="margin-bottom: 16px;">
            <?= render_logo('md', true, false) ?>
          </div>
          <p style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.6; margin-bottom: 20px;">
            <?= SITE_DESCRIPTION ?>
          </p>
          <div style="display: flex; gap: 14px; font-size: 1.1rem;">
            <a href="<?= SITE_TWITTER ?>" target="_blank" rel="noopener" style="color: var(--text-muted);"><i class="fa-brands fa-x-twitter"></i></a>
            <a href="<?= SITE_YOUTUBE ?>" target="_blank" rel="noopener" style="color: var(--text-muted);"><i class="fa-brands fa-youtube"></i></a>
            <a href="<?= url('sitemap.php') ?>" style="color: var(--text-muted);" title="XML Sitemap"><i class="fa-solid fa-rss"></i></a>
          </div>
        </div>

        <!-- Col 2: Categories -->
        <div class="footer-col">
          <h4>Gadget Hubs</h4>
          <ul class="footer-links">
            <li><a href="<?= url('category.php?slug=smartphones') ?>">Smartphones & Foldables</a></li>
            <li><a href="<?= url('category.php?slug=laptops-computing') ?>">Laptops & Custom Silicon</a></li>
            <li><a href="<?= url('category.php?slug=audio-earbuds') ?>">Audiophile & Earbuds</a></li>
            <li><a href="<?= url('category.php?slug=vr-wearables') ?>">Spatial Computing & VR</a></li>
            <li><a href="<?= url('category.php?slug=gaming-gear') ?>">Handheld PC & Gaming</a></li>
            <li><a href="<?= url('category.php?slug=ai-gadgets') ?>">Autonomous AI Devices</a></li>
          </ul>
        </div>

        <!-- Col 3: Editorial & Trust -->
        <div class="footer-col">
          <h4>Editorial & Trust</h4>
          <ul class="footer-links">
            <li><a href="<?= url('about.php') ?>">Hardware Testing Lab</a></li>
            <li><a href="<?= url('editorial-disclosure.php') ?>">Editorial Independence</a></li>
            <li><a href="<?= url('about.php#methodology') ?>">Benchmarking Methodology</a></li>
            <li><a href="<?= url('contact.php') ?>">Pitch Review Units</a></li>
            <li><a href="<?= url('privacy.php') ?>">Privacy Policy</a></li>
            <li><a href="<?= url('terms.php') ?>">Terms of Service</a></li>
          </ul>
        </div>

        <!-- Col 4: Newsletter -->
        <div class="footer-col">
          <h4>Tech Intelligence Dispatch</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 14px;">
            Weekly hardware lab benchmarks, thermal teardowns, and unfiltered gadget verdicts directly to your inbox.
          </p>
          <form onsubmit="event.preventDefault(); alert('Subscribed to GenZ Time Tech Intelligence! Welcome to the lab.'); this.reset();" style="display: flex; gap: 8px;">
            <input type="email" required placeholder="Enter your work email..." class="form-input" style="padding: 8px 12px; font-size: 0.85rem;">
            <button type="submit" class="btn btn-primary btn-sm" style="white-space: nowrap;">Join</button>
          </form>
        </div>
      </div>

      <div class="footer-bottom">
        <div>
          &copy; <?= date('Y') ?> <strong><?= SITE_NAME ?></strong>. All rights reserved. Built for high-ranking Google E-E-A-T search performance.
        </div>
        <div style="display: flex; gap: 16px;">
          <a href="<?= url('sitemap.php') ?>">XML Sitemap</a>
          <a href="<?= url('robots.txt') ?>">Robots.txt</a>
          <a href="<?= url('admin/index.php') ?>">Admin Portal</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- Main JavaScript File -->
  <script src="<?= asset('assets/js/main.js') ?>"></script>
</body>
</html>
