<?php
/**
 * GenZ Time - SEO Engine & Real-time Auditor
 * Implements Google ranking factors, structured JSON-LD schemas, and on-page score auditing.
 */

function seo_calculate_score(string $title, string $excerpt, string $content, string $focusKeyword, string $metaTitle, string $metaDescription): array {
    $score = 0;
    $checks = [];

    $cleanContent = strip_tags($content);
    $wordCount = str_word_count($cleanContent);
    $keyword = mb_strtolower(trim($focusKeyword));

    // 1. Focus Keyword Provided
    if (!empty($keyword)) {
        $checks[] = ['label' => 'Focus Keyword defined', 'pass' => true, 'points' => 5];
        $score += 5;

        // 2. Keyword in Title
        if (str_contains(mb_strtolower($title), $keyword)) {
            $checks[] = ['label' => 'Focus Keyword in Title', 'pass' => true, 'points' => 15];
            $score += 15;
        } else {
            $checks[] = ['label' => 'Focus Keyword missing from Title', 'pass' => false, 'points' => 0];
        }

        // 3. Keyword in Meta Description
        if (str_contains(mb_strtolower($metaDescription), $keyword)) {
            $checks[] = ['label' => 'Focus Keyword in Meta Description', 'pass' => true, 'points' => 10];
            $score += 10;
        } else {
            $checks[] = ['label' => 'Focus Keyword missing from Meta Description', 'pass' => false, 'points' => 0];
        }

        // 4. Keyword in Content & Density
        $kwOccurrences = substr_count(mb_strtolower($cleanContent), $keyword);
        $density = $wordCount > 0 ? round(($kwOccurrences / $wordCount) * 100, 2) : 0;

        if ($kwOccurrences >= 2 && $density >= 0.5 && $density <= 3.0) {
            $checks[] = ['label' => "Optimal Keyword Density ({$density}% - {$kwOccurrences}x)", 'pass' => true, 'points' => 15];
            $score += 15;
        } elseif ($kwOccurrences >= 1) {
            $checks[] = ['label' => "Keyword present in content ({$kwOccurrences}x, {$density}%)", 'pass' => true, 'points' => 8];
            $score += 8;
        } else {
            $checks[] = ['label' => 'Focus Keyword not found in content body', 'pass' => false, 'points' => 0];
        }

        // 5. Keyword in Headings
        if (preg_match('/<h[23][^>]*>.*?'.preg_quote($keyword, '/').'.*?<\/h[23]>/i', $content) ||
            preg_match('/##+.*?'.preg_quote($keyword, '/').'/i', $content)) {
            $checks[] = ['label' => 'Focus Keyword in H2/H3 Heading', 'pass' => true, 'points' => 10];
            $score += 10;
        } else {
            $checks[] = ['label' => 'Focus Keyword not found in any H2/H3 heading', 'pass' => false, 'points' => 0];
        }
    } else {
        $checks[] = ['label' => 'No Focus Keyword defined', 'pass' => false, 'points' => 0];
    }

    // 6. Title Length Check (50 - 65 chars ideal)
    $titleLen = mb_strlen($metaTitle ?: $title);
    if ($titleLen >= 40 && $titleLen <= 65) {
        $checks[] = ['label' => "Meta Title length optimal ({$titleLen}/60 chars)", 'pass' => true, 'points' => 10];
        $score += 10;
    } elseif ($titleLen > 65) {
        $checks[] = ['label' => "Meta Title slightly long ({$titleLen} chars, may truncate on Google)", 'pass' => false, 'points' => 5];
        $score += 5;
    } else {
        $checks[] = ['label' => "Meta Title too short ({$titleLen} chars)", 'pass' => false, 'points' => 3];
        $score += 3;
    }

    // 7. Meta Description Length (120 - 160 chars ideal)
    $descLen = mb_strlen($metaDescription);
    if ($descLen >= 110 && $descLen <= 165) {
        $checks[] = ['label' => "Meta Description length optimal ({$descLen}/160 chars)", 'pass' => true, 'points' => 10];
        $score += 10;
    } elseif ($descLen > 165) {
        $checks[] = ['label' => "Meta Description too long ({$descLen} chars, will truncate)", 'pass' => false, 'points' => 5];
        $score += 5;
    } else {
        $checks[] = ['label' => "Meta Description too short ({$descLen} chars)", 'pass' => false, 'points' => 3];
        $score += 3;
    }

    // 8. Word Count & In-Depth Depth
    if ($wordCount >= 600) {
        $checks[] = ['label' => "Comprehensive Hardware Review ({$wordCount} words)", 'pass' => true, 'points' => 15];
        $score += 15;
    } elseif ($wordCount >= 250) {
        $checks[] = ['label' => "Standard article length ({$wordCount} words)", 'pass' => true, 'points' => 10];
        $score += 10;
    } else {
        $checks[] = ['label' => "Thin content ({$wordCount} words, recommend 500+)", 'pass' => false, 'points' => 2];
        $score += 2;
    }

    // 9. Readability & Structure (Subheadings check)
    $headingCount = preg_match_all('/<h[2-4][^>]*>/i', $content) + preg_match_all('/^##+/m', $content);
    if ($headingCount >= 2) {
        $checks[] = ['label' => "Well-structured content ({$headingCount} subheadings)", 'pass' => true, 'points' => 10];
        $score += 10;
    } else {
        $checks[] = ['label' => "Needs more subheadings (H2/H3) for Google scannability", 'pass' => false, 'points' => 3];
        $score += 3;
    }

    $finalScore = min(100, max(0, $score));

    return [
        'score'  => $finalScore,
        'rating' => $finalScore >= 85 ? 'Exceptional' : ($finalScore >= 70 ? 'Good' : 'Needs Optimization'),
        'checks' => $checks,
        'stats'  => [
            'wordCount' => $wordCount,
            'titleLen'  => $titleLen,
            'descLen'   => $descLen,
            'keywordDensity' => isset($density) ? $density : 0
        ]
    ];
}

function seo_render_meta(array $meta): string {
    $title = !empty($meta['title']) ? $meta['title'] : (SITE_NAME . ' | ' . SITE_TAGLINE);
    $desc = !empty($meta['description']) ? $meta['description'] : SITE_DESCRIPTION;
    $canonical = !empty($meta['canonical']) ? $meta['canonical'] : BASE_URL . '/';
    $image = !empty($meta['image']) ? $meta['image'] : 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80';
    $keywords = !empty($meta['keywords']) ? (is_array($meta['keywords']) ? implode(', ', $meta['keywords']) : $meta['keywords']) : 'tech reviews, hardware benchmarks, smartphones, laptops, audio, spatial computing, AI gadgets';
    $type = !empty($meta['type']) ? $meta['type'] : 'website';

    $html = <<<HTML
  <title>{$title}</title>
  <meta name="description" content="{$desc}">
  <meta name="keywords" content="{$keywords}">
  <link rel="canonical" href="{$canonical}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">

  <!-- OpenGraph / Facebook -->
  <meta property="og:site_name" content="<?= SITE_NAME ?>">
  <meta property="og:type" content="{$type}">
  <meta property="og:title" content="{$title}">
  <meta property="og:description" content="{$desc}">
  <meta property="og:url" content="{$canonical}">
  <meta property="og:image" content="{$image}">
  <meta property="og:locale" content="en_US">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="<?= SITE_TWITTER ?>">
  <meta name="twitter:title" content="{$title}">
  <meta name="twitter:description" content="{$desc}">
  <meta name="twitter:image" content="{$image}">
HTML;

    return $html;
}

function seo_render_jsonld_article(array $post): string {
    $title = e($post['seo']['metaTitle'] ?? $post['title']);
    $desc = e($post['seo']['metaDescription'] ?? $post['excerpt']);
    $url = $post['seo']['canonicalUrl'] ?? (BASE_URL . '/post.php?slug=' . urlencode($post['slug']));
    $image = $post['featuredImage'] ?? '';
    $datePublished = date('c', strtotime($post['publishedAt'] ?? 'now'));
    $dateModified = date('c', strtotime($post['updatedAt'] ?? $post['publishedAt'] ?? 'now'));
    $score = $post['verdictScore'] ?? 9.0;
    $authorName = e($post['author']['name'] ?? SITE_AUTHOR);
    $category = e($post['category'] ?? 'Tech Hardware');

    $schema = [
        "@context" => "https://schema.org",
        "@graph" => [
            [
                "@type" => "TechArticle",
                "@id" => "{$url}#article",
                "isPartOf" => ["@id" => BASE_URL . "/#website"],
                "headline" => $title,
                "description" => $desc,
                "inLanguage" => "en-US",
                "mainEntityOfPage" => $url,
                "datePublished" => $datePublished,
                "dateModified" => $dateModified,
                "image" => $image,
                "articleSection" => $category,
                "author" => [
                    "@type" => "Person",
                    "name" => $authorName,
                    "url" => BASE_URL . "/about.php",
                    "jobTitle" => SITE_AUTHOR_ROLE
                ],
                "publisher" => [
                    "@type" => "Organization",
                    "name" => SITE_NAME,
                    "url" => BASE_URL . "/",
                    "logo" => [
                        "@type" => "ImageObject",
                        "url" => BASE_URL . "/assets/images/logo.png"
                    ]
                ]
            ],
            [
                "@type" => "Review",
                "itemReviewed" => [
                    "@type" => "Product",
                    "name" => $post['title'],
                    "image" => $image,
                    "category" => $category
                ],
                "reviewRating" => [
                    "@type" => "Rating",
                    "ratingValue" => (string)$score,
                    "bestRating" => "10",
                    "worstRating" => "1"
                ],
                "author" => [
                    "@type" => "Person",
                    "name" => $authorName
                ],
                "reviewBody" => $post['verdictSummary'] ?? $desc
            ],
            [
                "@type" => "BreadcrumbList",
                "itemListElement" => [
                    [
                        "@type" => "ListItem",
                        "position" => 1,
                        "name" => "Home",
                        "item" => BASE_URL . "/"
                    ],
                    [
                        "@type" => "ListItem",
                        "position" => 2,
                        "name" => $category,
                        "item" => BASE_URL . "/category.php?slug=" . ($post['categorySlug'] ?? 'all')
                    ],
                    [
                        "@type" => "ListItem",
                        "position" => 3,
                        "name" => $post['title'],
                        "item" => $url
                    ]
                ]
            ]
        ]
    ];

    return '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>';
}
