<?php
/**
 * GenZ Time - 1-Click Auto-SEO & Genuine Keyword Generator
 * Generates high-intent search terms, LSI tags, optimized meta title, and high-CTR meta description.
 */

function generate_auto_seo(string $title, string $category, string $content, array $specs = []): array {
    $cleanText = strip_tags($content);
    $titleClean = trim($title);

    // Stop words to ignore during keyword extraction
    $stopWords = [
        'the','and','for','with','this','that','from','have','more','will','your','about',
        'there','their','what','which','when','make','than','into','them','these','they',
        'just','been','some','very','after','over','also','most','even','first','well'
    ];

    // Extract potential model and brand from title
    $cleanTitleWords = preg_split('/[\s,\-\:\&\|\(\)]+/', $titleClean);
    $candidateKeywords = [];

    foreach ($cleanTitleWords as $w) {
        $wl = mb_strtolower(trim($w));
        if (mb_strlen($wl) > 2 && !in_array($wl, $stopWords)) {
            $candidateKeywords[] = ucfirst($wl);
        }
    }

    // Determine primary subject / model from title
    // E.g. "Apple Vision Pro 2 Review: The Spatial Computing Evolution" -> "Apple Vision Pro 2"
    $subjectMatch = preg_replace('/\s+(Review|Hands-on|Analysis|Benchmarks|Tested|Explained|Comparison|Vs).*$/i', '', $titleClean);
    $subject = trim($subjectMatch);
    if (empty($subject)) {
        $subject = implode(' ', array_slice($candidateKeywords, 0, 3));
    }

    // 1. Primary Focus Keyword
    $focusKeyword = $subject . ' review';

    // 2. Extract genuine tech keywords from content and specs
    $techTermsPool = [
        'Snapdragon', 'Apple Silicon', 'Bionic', 'Geekbench', 'AnTuTu', 'OLED', 'AMOLED',
        '120Hz', 'Promotion', 'Refresh Rate', 'Battery Life', 'Fast Charging', 'Mah', 'Wh',
        'Vapor Chamber', 'Thermals', 'Megapixels', 'Periscope Zoom', 'Computational Photography',
        'Hdr', 'Dolby Vision', 'Spatial Audio', 'Active Noise Cancellation', 'Titanium',
        'Micro-OLED', 'Spatial Computing', 'VisionOS', 'Ray Tracing', 'LPDDR5X', 'NVMe', 'SSD',
        'Thunderbolt 4', 'Wi-Fi 7', 'Bluetooth 5.4', 'Android 15', 'iOS 18', 'SteamOS'
    ];

    $detectedTerms = [];
    foreach ($techTermsPool as $term) {
        if (stripos($cleanText, $term) !== false || stripos(json_encode($specs), $term) !== false) {
            $detectedTerms[] = $term;
        }
    }

    // Build curated LSI keyword tags
    $tags = [];
    $tags[] = $subject;
    if (!empty($category)) {
        $tags[] = $category;
    }
    $tags[] = $subject . ' specs';
    $tags[] = $subject . ' benchmarks';

    foreach (array_slice($detectedTerms, 0, 4) as $dt) {
        $tags[] = $dt;
    }

    $tags = array_values(array_unique($tags));

    // 3. Generate High-CTR Meta Title (50-60 characters)
    // Formula: [Subject] Review: [Key Hardware Hook] | GenZ Time
    $hooks = [
        'Lab Benchmarks & Real-World Verdict',
        'Thermal & Battery Test Results',
        'Deep Hardware Analysis & Verdict',
        'Full Specs, Battery & Real Benchmarks',
        'Hands-On Testing & Lab Verdict'
    ];
    $hook = $hooks[abs(crc32($titleClean)) % count($hooks)];
    
    $site = SITE_NAME;
    $metaTitle = "{$subject} Review: {$hook} | {$site}";
    if (mb_strlen($metaTitle) > 65) {
        $metaTitle = "{$subject} In-Depth Review & Benchmarks | {$site}";
    }
    if (mb_strlen($metaTitle) > 65) {
        $metaTitle = "{$subject} Review & Lab Test | {$site}";
    }

    // 4. Generate High-CTR Meta Description (140-155 characters)
    // Must contain Focus Keyword naturally
    $descSample = substr(preg_replace('/\s+/', ' ', $cleanText), 0, 200);
    $metaDescription = "Read our comprehensive {$subject} review: sustained hardware benchmarks, battery rundown lab tests, display thermals, and expert verdict.";
    if (mb_strlen($metaDescription) > 160) {
        $metaDescription = "Comprehensive {$subject} review: lab benchmarks, battery tests, specs breakdown, and expert verdict from {$site}.";
    }

    return [
        'focusKeyword'    => $focusKeyword,
        'tags'            => $tags,
        'metaTitle'       => $metaTitle,
        'metaDescription' => $metaDescription,
        'canonicalUrl'    => BASE_URL . '/post.php?slug=' . urlencode(strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $titleClean), '-'))),
        'subject'         => $subject
    ];
}
