<?php
/**
 * GenZ Time - Admin CMS Dashboard
 */

require_once __DIR__ . '/../config/site.php';
require_once __DIR__ . '/../includes/db-helper.php';
require_once __DIR__ . '/auth.php';

$adminTitle = 'Hardware Review CMS Dashboard';
$adminNav = 'dashboard';

$posts = db_get_all_posts();
$totalViews = array_sum(array_column($posts, 'views'));
$avgScore = count($posts) > 0 ? array_sum(array_column($posts, 'verdictScore')) / count($posts) : 0;
$avgEeat = count($posts) > 0 ? array_sum(array_column($posts, 'eeatScore')) / count($posts) : 0;
$isMySQL = Database::isMySQL();

require_once __DIR__ . '/header.php';
?>

<div class="container">
  <!-- Top Bar -->
  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 16px;">
    <div>
      <h1 style="font-size: 2.2rem; color: #fff; margin-bottom: 6px;">Hardware CMS Dashboard</h1>
      <p style="color: var(--text-muted); font-size: 0.92rem;">
        Manage published gadget reviews, monitor real-time Google E-E-A-T ratings, and launch new benchmark reports.
      </p>
    </div>
    <div style="display: flex; gap: 12px;">
      <a href="<?= url('install.php') ?>" class="btn btn-secondary btn-sm" title="Database Configuration">
        <i class="fa-solid fa-database"></i> DB Status: <?= $isMySQL ? '<span style="color:#10B981;font-weight:700;">MySQL Connected</span>' : '<span style="color:#06B6D4;font-weight:700;">Resilient JSON Active</span>' ?>
      </a>
      <a href="<?= url('admin/publish.php') ?>" class="btn btn-primary">
        <i class="fa-solid fa-plus"></i> New Hardware Review
      </a>
    </div>
  </div>

  <!-- Metric Counters Grid -->
  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 36px;">
    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px;">
      <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Published Reviews</div>
      <div style="font-size: 2rem; font-weight: 800; color: #fff; font-family: 'Space Grotesk';"><?= count($posts) ?></div>
      <div style="font-size: 0.75rem; color: var(--accent-cyan-light); margin-top: 4px;">Across 8 tech verticals</div>
    </div>

    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px;">
      <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Total Hardware Reads</div>
      <div style="font-size: 2rem; font-weight: 800; color: var(--accent-cyan); font-family: 'Space Grotesk';"><?= number_format($totalViews) ?></div>
      <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 4px;">Verified organic impressions</div>
    </div>

    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px;">
      <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Avg Verdict Rating</div>
      <div style="font-size: 2rem; font-weight: 800; color: var(--accent-emerald); font-family: 'Space Grotesk';"><?= number_format($avgScore, 1) ?> <span style="font-size: 1rem; color: var(--text-dim);">/10</span></div>
      <div style="font-size: 0.75rem; color: var(--accent-emerald); margin-top: 4px;">Lab calibrated scoring</div>
    </div>

    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px;">
      <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Avg Google E-E-A-T</div>
      <div style="font-size: 2rem; font-weight: 800; color: var(--accent-purple); font-family: 'Space Grotesk';"><?= round($avgEeat) ?> <span style="font-size: 1rem; color: var(--text-dim);">/100</span></div>
      <div style="font-size: 0.75rem; color: var(--accent-purple); margin-top: 4px;">Top Search Quality Tier</div>
    </div>
  </div>

  <!-- Post Management Table Card -->
  <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); overflow: hidden;">
    <div style="padding: 20px 24px; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
      <h3 style="font-size: 1.2rem; color: #fff;">Hardware Review Inventory</h3>
      <span class="mono" style="font-size: 0.8rem; color: var(--text-dim);"><?= count($posts) ?> Entries Logged</span>
    </div>

    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
        <thead>
          <tr style="background: #090E1B; border-bottom: 1px solid var(--border-subtle); color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
            <th style="padding: 14px 20px;">Review Title &amp; Vertical</th>
            <th style="padding: 14px 16px;">Verdict</th>
            <th style="padding: 14px 16px;">E-E-A-T</th>
            <th style="padding: 14px 16px;">Originality</th>
            <th style="padding: 14px 16px;">Reads</th>
            <th style="padding: 14px 16px;">Published</th>
            <th style="padding: 14px 20px; text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($posts as $p): ?>
          <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.04); transition: background 0.15s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
            <!-- Title -->
            <td style="padding: 16px 20px;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <img src="<?= e($p['featuredImage']) ?>" alt="<?= e($p['title']) ?>" style="width: 50px; height: 42px; border-radius: 6px; object-fit: cover; flex-shrink: 0;">
                <div>
                  <a href="<?= url('post.php?slug=' . urlencode($p['slug'])) ?>" target="_blank" style="color: #fff; font-weight: 600; font-size: 0.92rem; display: block; margin-bottom: 3px;">
                    <?= e($p['title']) ?>
                  </a>
                  <span class="category-tag" style="font-size: 0.65rem; padding: 2px 6px;"><?= e($p['category']) ?></span>
                </div>
              </div>
            </td>

            <!-- Verdict -->
            <td style="padding: 16px 16px;">
              <span class="score-badge" style="font-size: 0.75rem; padding: 2px 8px;">
                ★ <?= number_format($p['verdictScore'], 1) ?>
              </span>
            </td>

            <!-- E-E-A-T -->
            <td style="padding: 16px 16px;">
              <span class="mono" style="color: <?= $p['eeatScore'] >= 90 ? '#10B981' : '#06B6D4' ?>; font-weight: 700; font-size: 0.82rem;">
                <?= $p['eeatScore'] ?>/100
              </span>
            </td>

            <!-- Originality -->
            <td style="padding: 16px 16px;">
              <span class="mono" style="color: <?= $p['originalityScore'] >= 90 ? '#10B981' : '#F59E0B' ?>; font-weight: 700; font-size: 0.82rem;">
                <?= $p['originalityScore'] ?>%
              </span>
            </td>

            <!-- Reads -->
            <td style="padding: 16px 16px; color: var(--text-dim);" class="mono">
              <?= number_format($p['views'] ?? 0) ?>
            </td>

            <!-- Published Date -->
            <td style="padding: 16px 16px; color: var(--text-dim); font-size: 0.8rem;" class="mono">
              <?= date('M d, Y', strtotime($p['publishedAt'])) ?>
            </td>

            <!-- Actions -->
            <td style="padding: 16px 20px; text-align: right;">
              <div style="display: flex; gap: 8px; justify-content: flex-end;">
                <a href="<?= url('post.php?slug=' . urlencode($p['slug'])) ?>" target="_blank" class="btn btn-secondary btn-sm" title="View Live Review">
                  <i class="fa-solid fa-eye"></i>
                </a>
                <a href="<?= url('admin/edit.php?id=' . urlencode($p['id'])) ?>" class="btn btn-secondary btn-sm" title="Edit Review">
                  <i class="fa-solid fa-pen-to-square"></i>
                </a>
                <a href="<?= url('admin/delete.php?id=' . urlencode($p['id'])) ?>" onclick="return confirm('Are you sure you want to delete this review?');" class="btn btn-secondary btn-sm" style="color: #FB7185; border-color: rgba(244,63,94,0.3);" title="Delete Review">
                  <i class="fa-solid fa-trash"></i>
                </a>
              </div>
            </td>
          </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </div>
</div>

<?php require_once __DIR__ . '/footer.php'; ?>
