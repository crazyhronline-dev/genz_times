<?php
/**
 * GenZ Time - Google E-E-A-T Quality Engine
 * Evaluates Experience, Expertise, Authoritativeness, and Trustworthiness.
 */

function calculate_eeat_score(array $post): array {
    $score = 0;
    $pillars = [
        'experience' => ['score' => 0, 'max' => 25, 'label' => 'Hands-On Experience', 'checks' => []],
        'expertise'  => ['score' => 0, 'max' => 25, 'label' => 'Technical Expertise', 'checks' => []],
        'author'     => ['score' => 0, 'max' => 25, 'label' => 'Authoritativeness', 'checks' => []],
        'trust'      => ['score' => 0, 'max' => 25, 'label' => 'Trustworthiness', 'checks' => []],
    ];

    $content = $post['content'] ?? '';
    $specs = $post['specs'] ?? [];
    $pros = $post['pros'] ?? [];
    $cons = $post['cons'] ?? [];
    $author = $post['author'] ?? [];

    // 1. Experience Pillar (25 pts)
    $expScore = 0;
    if (preg_match('/(our lab|bench test|in our testing|we measured|rundown test|72-hour|hands-on|our testing)/i', $content)) {
        $expScore += 15;
        $pillars['experience']['checks'][] = 'First-party physical testing & lab measurements logged';
    } else {
        $expScore += 5;
        $pillars['experience']['checks'][] = 'Standard review observations';
    }
    if (preg_match('/(\d+\s*(hours|hrs|mins|wh|mah|watts|°c|nits|db))/i', $content)) {
        $expScore += 10;
        $pillars['experience']['checks'][] = 'Empirical physical units measured (thermals, battery, decibels, nits)';
    }
    $pillars['experience']['score'] = min(25, $expScore);
    $score += $pillars['experience']['score'];

    // 2. Expertise Pillar (25 pts)
    $expertScore = 0;
    if (!empty($specs) && count($specs) >= 4) {
        $expertScore += 15;
        $pillars['expertise']['checks'][] = 'Granular component hardware specification table provided';
    } elseif (!empty($specs)) {
        $expertScore += 8;
        $pillars['expertise']['checks'][] = 'Basic hardware specs listed';
    }
    if (preg_match('/(architecture|silicon|cache|transistor|latency|dynamic range|codec|frequency response|cooling loop)/i', $content)) {
        $expertScore += 10;
        $pillars['expertise']['checks'][] = 'Deep architectural and component engineering breakdown';
    }
    $pillars['expertise']['score'] = min(25, $expertScore);
    $score += $pillars['expertise']['score'];

    // 3. Authoritativeness Pillar (25 pts)
    $authScore = 0;
    if (!empty($author['name']) && !empty($author['role'])) {
        $authScore += 15;
        $pillars['author']['checks'][] = 'Identified lead analyst credentials (' . e($author['name']) . ')';
    }
    if (!empty($author['bio'])) {
        $authScore += 10;
        $pillars['author']['checks'][] = 'Documented domain experience & testing background';
    }
    $pillars['author']['score'] = min(25, $authScore);
    $score += $pillars['author']['score'];

    // 4. Trustworthiness Pillar (25 pts)
    $trustScore = 0;
    if (!empty($pros) && !empty($cons) && count($pros) >= 2 && count($cons) >= 1) {
        $trustScore += 15;
        $pillars['trust']['checks'][] = 'Balanced editorial scrutiny (Independent Pros & Cons)';
    }
    if (!empty($post['verdictSummary']) && !empty($post['verdictScore'])) {
        $trustScore += 10;
        $pillars['trust']['checks'][] = 'Transparent numerical scoring & executive verdict summary';
    }
    $pillars['trust']['score'] = min(25, $trustScore);
    $score += $pillars['trust']['score'];

    return [
        'score'   => $score,
        'rating'  => $score >= 90 ? 'E-E-A-T Tier 1 (Google Authority)' : ($score >= 75 ? 'E-E-A-T Tier 2 (Solid)' : 'Tier 3 (Needs Polish)'),
        'pillars' => $pillars
    ];
}

function render_eeat_badge(int $score): string {
    $color = $score >= 90 ? '#10B981' : ($score >= 75 ? '#06B6D4' : '#F59E0B');
    $badgeText = $score >= 90 ? 'GOOGLE E-E-A-T VERIFIED' : 'E-E-A-T COMPLIANT';

    return <<<HTML
<div class="eeat-badge-container" style="display: inline-flex; align-items: center; gap: 8px; background: rgba(15, 23, 42, 0.8); border: 1px solid {$color}; padding: 6px 14px; border-radius: 9999px; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: #E2E8F0; box-shadow: 0 0 15px rgba(6, 182, 212, 0.15);">
  <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: {$color}; box-shadow: 0 0 8px {$color};"></span>
  <span style="color: #94A3B8; font-weight: 600;">{$badgeText}:</span>
  <strong style="color: {$color}; font-weight: 700;">{$score}/100</strong>
  <span style="color: #64748B; font-size: 0.7rem; margin-left: 4px;">• Independent Lab</span>
</div>
HTML;
}
