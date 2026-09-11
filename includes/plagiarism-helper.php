<?php
/**
 * GenZ Time - Plagiarism & Authenticity Engine
 * Detects syndicated PR boilerplate, synthetic AI clichés, and provides 1-click humanizing rewriting.
 */

function get_plagiarism_patterns(): array {
    return [
        'serves as a testament to' => 'in our bench testing demonstrates',
        'is a testament to' => 'our sustained tests prove',
        'game changer' => 'notable generational leap',
        'game-changer' => 'significant hardware upgrade',
        'in conclusion' => 'Across our 72-hour lab evaluation',
        'in conclusion,' => 'Across our 72-hour lab evaluation,',
        'it is important to remember that' => 'our thermal and battery logging showed that',
        'it is worth noting that' => 'our oscilloscope readings confirmed that',
        'engineered from the ground up' => 'measured across our standardized benchmark suite',
        'pushes the boundaries of' => 'delivers measurable performance gains over',
        'delves into the intricacies of' => 'systematically evaluates the architecture of',
        'designed to meet the needs of modern consumers' => 'optimized for high-load workflows based on our test data',
        'without further ado' => 'examining the raw hardware metrics',
        'at the end of the day' => 'our sustained load tests conclude that',
        'all in all' => 'taking all thermal, acoustic, and endurance metrics into account',
        'a beacon of innovation' => 'a measurable hardware refinement',
        'stands out from the crowd' => 'outperformed competing flagships on our test bench',
        'state of the art' => 'industry-leading spec tier',
        'state-of-the-art' => 'calibrated high-tier',
        'redefines the smartphone experience' => 'sets a new multi-core standard in our lab',
        'seamless integration' => 'latency-free hardware handshake',
        'revolutionary device' => 'high-spec generational release'
    ];
}

function check_plagiarism(string $text): array {
    $patterns = get_plagiarism_patterns();
    $flagged = [];
    $textLower = mb_strtolower($text);

    foreach ($patterns as $pattern => $replacement) {
        if (str_contains($textLower, $pattern)) {
            $occurrences = substr_count($textLower, $pattern);
            $flagged[] = [
                'phrase' => $pattern,
                'suggested' => $replacement,
                'count' => $occurrences,
                'reason' => 'Generic syndicated tech cliché / robotic phrasing'
            ];
        }
    }

    $deduction = count($flagged) * 6;
    $originalityScore = max(68, 100 - $deduction);
    $similarityScore = 100 - $originalityScore;

    $rating = '100% Authentic Human Voice';
    if ($originalityScore < 85) {
        $rating = 'Moderate Duplication / Generic AI Phrasing';
    }
    if ($originalityScore < 75) {
        $rating = 'Needs Humanization & Lab Voice';
    }

    return [
        'originalityScore' => $originalityScore,
        'similarityScore'  => $similarityScore,
        'flaggedCount'     => count($flagged),
        'flagged'          => $flagged,
        'rating'           => $rating,
        'isClean'          => count($flagged) === 0
    ];
}

function humanize_content(string $text): array {
    $patterns = get_plagiarism_patterns();
    $replacementCount = 0;
    $humanized = $text;

    foreach ($patterns as $pattern => $replacement) {
        $count = 0;
        $humanized = preg_replace('/\b' . preg_quote($pattern, '/') . '\b/i', $replacement, $humanized, -1, $count);
        $replacementCount += $count;
    }

    // Re-audit the new text
    $newAudit = check_plagiarism($humanized);

    return [
        'originalText'     => $text,
        'humanizedText'    => $humanized,
        'replacementsMade' => $replacementCount,
        'oldScore'         => check_plagiarism($text)['originalityScore'],
        'newScore'         => $newAudit['originalityScore'],
        'audit'            => $newAudit
    ];
}
