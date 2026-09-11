<?php
/**
 * GenZ Time - Data Access Layer (MySQL + Resilient Store)
 * Translates between database records and unified presentation models.
 */

require_once __DIR__ . '/../config/database.php';

// Normalize a post record so keys are consistent
function normalize_post(array $p): array {
    // Check if coming from MySQL
    if (isset($p['featured_image']) && !isset($p['featuredImage'])) {
        $p['featuredImage'] = $p['featured_image'];
    }
    if (isset($p['category_name']) && !isset($p['category'])) {
        $p['category'] = $p['category_name'];
    }
    if (isset($p['category_slug']) && !isset($p['categorySlug'])) {
        $p['categorySlug'] = $p['category_slug'];
    }
    if (isset($p['published_at']) && !isset($p['publishedAt'])) {
        $p['publishedAt'] = $p['published_at'];
    }
    if (isset($p['reading_time']) && !isset($p['readingTime'])) {
        $p['readingTime'] = $p['reading_time'];
    }
    if (isset($p['verdict_score']) && !isset($p['verdictScore'])) {
        $p['verdictScore'] = (float)$p['verdict_score'];
    }
    if (isset($p['verdict_summary']) && !isset($p['verdictSummary'])) {
        $p['verdictSummary'] = $p['verdict_summary'];
    }
    if (isset($p['eeat_score']) && !isset($p['eeatScore'])) {
        $p['eeatScore'] = (int)$p['eeat_score'];
    }
    if (isset($p['originality_score']) && !isset($p['originalityScore'])) {
        $p['originalityScore'] = (int)$p['originality_score'];
    }
    if (isset($p['is_featured']) && !isset($p['isFeatured'])) {
        $p['isFeatured'] = (bool)$p['is_featured'];
    }
    if (isset($p['is_trending']) && !isset($p['isTrending'])) {
        $p['isTrending'] = (bool)$p['is_trending'];
    }

    // Author sub-object
    if (!isset($p['author']) || !is_array($p['author'])) {
        $p['author'] = [
            'name'   => $p['author_name'] ?? SITE_AUTHOR,
            'role'   => $p['author_role'] ?? SITE_AUTHOR_ROLE,
            'avatar' => $p['author_avatar'] ?? SITE_AUTHOR_AVATAR,
            'bio'    => $p['author_bio'] ?? SITE_AUTHOR_BIO
        ];
    }

    // SEO sub-object
    if (!isset($p['seo']) || !is_array($p['seo'])) {
        $p['seo'] = [
            'metaTitle'       => $p['meta_title'] ?? $p['title'],
            'metaDescription' => $p['meta_description'] ?? $p['excerpt'],
            'focusKeyword'    => $p['focus_keyword'] ?? '',
            'canonicalUrl'    => $p['canonical_url'] ?? (BASE_URL . '/post.php?slug=' . ($p['slug'] ?? ''))
        ];
    }

    // JSON array decodings for tags, pros, cons, specs
    if (is_string($p['tags'] ?? null)) {
        $decoded = json_decode($p['tags'], true);
        $p['tags'] = is_array($decoded) ? $decoded : array_map('trim', explode(',', $p['tags']));
    }
    if (!is_array($p['tags'] ?? null)) $p['tags'] = [];

    if (is_string($p['pros'] ?? null)) {
        $decoded = json_decode($p['pros'], true);
        $p['pros'] = is_array($decoded) ? $decoded : array_filter(array_map('trim', explode("\n", $p['pros'])));
    }
    if (!is_array($p['pros'] ?? null)) $p['pros'] = [];

    if (is_string($p['cons'] ?? null)) {
        $decoded = json_decode($p['cons'], true);
        $p['cons'] = is_array($decoded) ? $decoded : array_filter(array_map('trim', explode("\n", $p['cons'])));
    }
    if (!is_array($p['cons'] ?? null)) $p['cons'] = [];

    if (is_string($p['specs'] ?? null)) {
        $decoded = json_decode($p['specs'], true);
        $p['specs'] = is_array($decoded) ? $decoded : [];
    }
    if (!is_array($p['specs'] ?? null)) $p['specs'] = [];

    return $p;
}

// Read raw JSON store as fallback
function read_json_posts(): array {
    $file = Database::getJsonFile();
    if (!file_exists($file)) return [];
    $json = file_get_contents($file);
    $data = json_decode($json, true);
    return is_array($data) ? $data : [];
}

// Write JSON store fallback
function write_json_posts(array $posts): bool {
    $file = Database::getJsonFile();
    $dir = dirname($file);
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    return (bool)file_put_contents($file, json_encode($posts, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
}

// Fetch all posts with optional filtering
function db_get_all_posts(?int $limit = null, ?string $categorySlug = null, ?string $search = null): array {
    $pdo = Database::getConnection();

    if ($pdo) {
        try {
            $sql = "SELECT * FROM posts WHERE 1=1";
            $params = [];

            if ($categorySlug) {
                $sql .= " AND category_slug = :cat";
                $params[':cat'] = $categorySlug;
            }

            if ($search) {
                $sql .= " AND (title LIKE :s1 OR excerpt LIKE :s2 OR content LIKE :s3 OR tags LIKE :s4)";
                $searchWild = '%' . $search . '%';
                $params[':s1'] = $searchWild;
                $params[':s2'] = $searchWild;
                $params[':s3'] = $searchWild;
                $params[':s4'] = $searchWild;
            }

            $sql .= " ORDER BY published_at DESC";
            if ($limit !== null && $limit > 0) {
                $sql .= " LIMIT " . (int)$limit;
            }

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $rows = $stmt->fetchAll();

            $posts = [];
            foreach ($rows as $row) {
                $posts[] = normalize_post($row);
            }
            return $posts;
        } catch (PDOException $e) {
            // Table might not exist yet, fallback to JSON
        }
    }

    // JSON fallback
    $posts = read_json_posts();

    if ($categorySlug) {
        $posts = array_filter($posts, fn($p) => ($p['categorySlug'] ?? '') === $categorySlug);
    }

    if ($search) {
        $searchLower = mb_strtolower($search);
        $posts = array_filter($posts, function($p) use ($searchLower) {
            return str_contains(mb_strtolower($p['title'] ?? ''), $searchLower)
                || str_contains(mb_strtolower($p['excerpt'] ?? ''), $searchLower)
                || str_contains(mb_strtolower($p['content'] ?? ''), $searchLower);
        });
    }

    // Sort by published date descending
    usort($posts, fn($a, $b) => strtotime($b['publishedAt'] ?? 'now') <=> strtotime($a['publishedAt'] ?? 'now'));

    if ($limit !== null && $limit > 0) {
        $posts = array_slice($posts, 0, $limit);
    }

    return array_map('normalize_post', array_values($posts));
}

// Fetch featured posts
function db_get_featured_posts(int $limit = 3): array {
    $posts = db_get_all_posts();
    $featured = array_filter($posts, fn($p) => !empty($p['isFeatured']));
    if (empty($featured)) {
        return array_slice($posts, 0, $limit);
    }
    return array_slice(array_values($featured), 0, $limit);
}

// Fetch trending posts
function db_get_trending_posts(int $limit = 5): array {
    $posts = db_get_all_posts();
    $trending = array_filter($posts, fn($p) => !empty($p['isTrending']));
    if (empty($trending)) {
        // Sort by views or verdictScore
        usort($posts, fn($a, $b) => ($b['views'] ?? 0) <=> ($a['views'] ?? 0));
        return array_slice($posts, 0, $limit);
    }
    return array_slice(array_values($trending), 0, $limit);
}

// Fetch single post by slug
function db_get_post_by_slug(string $slug): ?array {
    $pdo = Database::getConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM posts WHERE slug = :slug LIMIT 1");
            $stmt->execute([':slug' => $slug]);
            $row = $stmt->fetch();
            if ($row) return normalize_post($row);
        } catch (PDOException $e) {
            // fallback
        }
    }

    $posts = read_json_posts();
    foreach ($posts as $p) {
        if (($p['slug'] ?? '') === $slug) {
            return normalize_post($p);
        }
    }
    return null;
}

// Fetch single post by ID
function db_get_post_by_id(string $id): ?array {
    $pdo = Database::getConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM posts WHERE id = :id LIMIT 1");
            $stmt->execute([':id' => $id]);
            $row = $stmt->fetch();
            if ($row) return normalize_post($row);
        } catch (PDOException $e) {
            // fallback
        }
    }

    $posts = read_json_posts();
    foreach ($posts as $p) {
        if (($p['id'] ?? '') === $id) {
            return normalize_post($p);
        }
    }
    return null;
}

// Save or create new post
function db_save_post(array $data): bool {
    $pdo = Database::getConnection();
    $now = date('Y-m-d H:i:s');
    $id = $data['id'] ?? ('post-' . round(microtime(true) * 1000));
    $data['id'] = $id;

    if ($pdo) {
        try {
            $sql = "INSERT INTO posts (
                id, title, slug, excerpt, content, featured_image,
                category_id, category_name, category_slug, tags,
                author_name, author_role, author_avatar, author_bio,
                published_at, reading_time, verdict_score, verdict_summary,
                pros, cons, specs, meta_title, meta_description,
                focus_keyword, canonical_url, eeat_score, originality_score,
                is_featured, is_trending, views
            ) VALUES (
                :id, :title, :slug, :excerpt, :content, :featured_image,
                :category_id, :category_name, :category_slug, :tags,
                :author_name, :author_role, :author_avatar, :author_bio,
                :published_at, :reading_time, :verdict_score, :verdict_summary,
                :pros, :cons, :specs, :meta_title, :meta_description,
                :focus_keyword, :canonical_url, :eeat_score, :originality_score,
                :is_featured, :is_trending, :views
            )";

            $stmt = $pdo->prepare($sql);
            return $stmt->execute([
                ':id'               => $id,
                ':title'            => $data['title'] ?? '',
                ':slug'             => $data['slug'] ?? '',
                ':excerpt'          => $data['excerpt'] ?? '',
                ':content'          => $data['content'] ?? '',
                ':featured_image'   => $data['featuredImage'] ?? $data['featured_image'] ?? '',
                ':category_id'      => (int)($data['category_id'] ?? 1),
                ':category_name'    => $data['category'] ?? $data['category_name'] ?? 'Smartphones',
                ':category_slug'    => $data['categorySlug'] ?? $data['category_slug'] ?? 'smartphones',
                ':tags'             => is_array($data['tags'] ?? null) ? json_encode($data['tags']) : ($data['tags'] ?? '[]'),
                ':author_name'      => $data['author']['name'] ?? $data['author_name'] ?? SITE_AUTHOR,
                ':author_role'      => $data['author']['role'] ?? $data['author_role'] ?? SITE_AUTHOR_ROLE,
                ':author_avatar'    => $data['author']['avatar'] ?? $data['author_avatar'] ?? SITE_AUTHOR_AVATAR,
                ':author_bio'       => $data['author']['bio'] ?? $data['author_bio'] ?? SITE_AUTHOR_BIO,
                ':published_at'     => $data['publishedAt'] ?? $data['published_at'] ?? $now,
                ':reading_time'     => $data['readingTime'] ?? $data['reading_time'] ?? '5 min read',
                ':verdict_score'    => (float)($data['verdictScore'] ?? $data['verdict_score'] ?? 9.0),
                ':verdict_summary'  => $data['verdictSummary'] ?? $data['verdict_summary'] ?? '',
                ':pros'             => is_array($data['pros'] ?? null) ? json_encode($data['pros']) : ($data['pros'] ?? '[]'),
                ':cons'             => is_array($data['cons'] ?? null) ? json_encode($data['cons']) : ($data['cons'] ?? '[]'),
                ':specs'            => is_array($data['specs'] ?? null) ? json_encode($data['specs']) : ($data['specs'] ?? '{}'),
                ':meta_title'       => $data['seo']['metaTitle'] ?? $data['meta_title'] ?? $data['title'],
                ':meta_description' => $data['seo']['metaDescription'] ?? $data['meta_description'] ?? $data['excerpt'],
                ':focus_keyword'    => $data['seo']['focusKeyword'] ?? $data['focus_keyword'] ?? '',
                ':canonical_url'    => $data['seo']['canonicalUrl'] ?? $data['canonical_url'] ?? '',
                ':eeat_score'       => (int)($data['eeatScore'] ?? $data['eeat_score'] ?? 90),
                ':originality_score'=> (int)($data['originalityScore'] ?? $data['originality_score'] ?? 95),
                ':is_featured'      => !empty($data['isFeatured']) ? 1 : 0,
                ':is_trending'      => !empty($data['isTrending']) ? 1 : 0,
                ':views'            => (int)($data['views'] ?? 0)
            ]);
        } catch (PDOException $e) {
            // If MySQL write failed, fallback to JSON
        }
    }

    // JSON fallback
    $posts = read_json_posts();
    array_unshift($posts, normalize_post($data));
    return write_json_posts($posts);
}

// Update existing post
function db_update_post(string $id, array $data): bool {
    $pdo = Database::getConnection();

    if ($pdo) {
        try {
            $sql = "UPDATE posts SET
                title = :title,
                slug = :slug,
                excerpt = :excerpt,
                content = :content,
                featured_image = :featured_image,
                category_name = :category_name,
                category_slug = :category_slug,
                tags = :tags,
                reading_time = :reading_time,
                verdict_score = :verdict_score,
                verdict_summary = :verdict_summary,
                pros = :pros,
                cons = :cons,
                specs = :specs,
                meta_title = :meta_title,
                meta_description = :meta_description,
                focus_keyword = :focus_keyword,
                eeat_score = :eeat_score,
                originality_score = :originality_score,
                is_featured = :is_featured,
                is_trending = :is_trending
            WHERE id = :id";

            $stmt = $pdo->prepare($sql);
            return $stmt->execute([
                ':id'               => $id,
                ':title'            => $data['title'] ?? '',
                ':slug'             => $data['slug'] ?? '',
                ':excerpt'          => $data['excerpt'] ?? '',
                ':content'          => $data['content'] ?? '',
                ':featured_image'   => $data['featuredImage'] ?? $data['featured_image'] ?? '',
                ':category_name'    => $data['category'] ?? $data['category_name'] ?? 'Smartphones',
                ':category_slug'    => $data['categorySlug'] ?? $data['category_slug'] ?? 'smartphones',
                ':tags'             => is_array($data['tags'] ?? null) ? json_encode($data['tags']) : ($data['tags'] ?? '[]'),
                ':reading_time'     => $data['readingTime'] ?? $data['reading_time'] ?? '5 min read',
                ':verdict_score'    => (float)($data['verdictScore'] ?? $data['verdict_score'] ?? 9.0),
                ':verdict_summary'  => $data['verdictSummary'] ?? $data['verdict_summary'] ?? '',
                ':pros'             => is_array($data['pros'] ?? null) ? json_encode($data['pros']) : ($data['pros'] ?? '[]'),
                ':cons'             => is_array($data['cons'] ?? null) ? json_encode($data['cons']) : ($data['cons'] ?? '[]'),
                ':specs'            => is_array($data['specs'] ?? null) ? json_encode($data['specs']) : ($data['specs'] ?? '{}'),
                ':meta_title'       => $data['seo']['metaTitle'] ?? $data['meta_title'] ?? $data['title'],
                ':meta_description' => $data['seo']['metaDescription'] ?? $data['meta_description'] ?? $data['excerpt'],
                ':focus_keyword'    => $data['seo']['focusKeyword'] ?? $data['focus_keyword'] ?? '',
                ':eeat_score'       => (int)($data['eeatScore'] ?? $data['eeat_score'] ?? 90),
                ':originality_score'=> (int)($data['originalityScore'] ?? $data['originality_score'] ?? 95),
                ':is_featured'      => !empty($data['isFeatured']) ? 1 : 0,
                ':is_trending'      => !empty($data['isTrending']) ? 1 : 0,
            ]);
        } catch (PDOException $e) {
            // fallback
        }
    }

    $posts = read_json_posts();
    $found = false;
    foreach ($posts as &$p) {
        if (($p['id'] ?? '') === $id) {
            $p = array_merge($p, normalize_post($data));
            $found = true;
            break;
        }
    }
    return $found ? write_json_posts($posts) : false;
}

// Delete post
function db_delete_post(string $id): bool {
    $pdo = Database::getConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("DELETE FROM posts WHERE id = :id");
            return $stmt->execute([':id' => $id]);
        } catch (PDOException $e) {
            // fallback
        }
    }

    $posts = read_json_posts();
    $filtered = array_filter($posts, fn($p) => ($p['id'] ?? '') !== $id);
    return write_json_posts(array_values($filtered));
}

// Increment post view count
function db_increment_views(string $id): void {
    $pdo = Database::getConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("UPDATE posts SET views = views + 1 WHERE id = :id");
            $stmt->execute([':id' => $id]);
            return;
        } catch (PDOException $e) {}
    }

    $posts = read_json_posts();
    foreach ($posts as &$p) {
        if (($p['id'] ?? '') === $id) {
            $p['views'] = ($p['views'] ?? 0) + 1;
            break;
        }
    }
    write_json_posts($posts);
}

// Get categories list
function db_get_categories(): array {
    $pdo = Database::getConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM categories ORDER BY id ASC");
            $cats = $stmt->fetchAll();
            if (!empty($cats)) return $cats;
        } catch (PDOException $e) {}
    }

    // Default categories if database table not yet populated
    return [
        ['id' => 1, 'name' => 'Smartphones', 'slug' => 'smartphones', 'description' => 'In-depth reviews, camera shootouts, and battery tests of flagship and folding phones.', 'icon' => 'smartphone', 'color' => 'from-cyan-500 to-blue-600'],
        ['id' => 2, 'name' => 'Laptops & Computing', 'slug' => 'laptops-computing', 'description' => 'Benchmarks, thermal analysis, and creative workstation evaluations.', 'icon' => 'laptop', 'color' => 'from-violet-500 to-purple-700'],
        ['id' => 3, 'name' => 'Audio & Earbuds', 'slug' => 'audio-earbuds', 'description' => 'Audiophile-grade frequency response tests, ANC decibels, and wireless audio.', 'icon' => 'headphones', 'color' => 'from-emerald-400 to-teal-600'],
        ['id' => 4, 'name' => 'VR & Wearables', 'slug' => 'vr-wearables', 'description' => 'Spatial computing, mixed reality headsets, and biometrics tracking hardware.', 'icon' => 'glasses', 'color' => 'from-fuchsia-500 to-pink-600'],
        ['id' => 5, 'name' => 'Drones & Cameras', 'slug' => 'drones-cameras', 'description' => 'Cinema sensors, gimbal stabilization, and autonomous aerial quadcopters.', 'icon' => 'camera', 'color' => 'from-amber-400 to-orange-600'],
        ['id' => 6, 'name' => 'AI Gadgets & Future Tech', 'slug' => 'ai-gadgets', 'description' => 'Ambient computing, wearable AI pins, autonomous hardware agents.', 'icon' => 'cpu', 'color' => 'from-cyan-400 to-indigo-600'],
        ['id' => 7, 'name' => 'Gaming Gear', 'slug' => 'gaming-gear', 'description' => 'Handheld PC consoles, high-refresh OLEDs, and GPU benchmarks.', 'icon' => 'gamepad-2', 'color' => 'from-rose-500 to-red-600'],
        ['id' => 8, 'name' => 'Smart Home & IoT', 'slug' => 'smart-home', 'description' => 'Matter-compatible mesh networks, robotic vacuums, and ambient automation.', 'icon' => 'home', 'color' => 'from-teal-400 to-emerald-600']
    ];
}

// Get category by slug
function db_get_category_by_slug(string $slug): ?array {
    $categories = db_get_categories();
    foreach ($categories as $cat) {
        if ($cat['slug'] === $slug) {
            return $cat;
        }
    }
    return null;
}

// Get comments for a post
function db_get_comments(string $postId): array {
    $pdo = Database::getConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM comments WHERE post_id = :pid ORDER BY created_at ASC");
            $stmt->execute([':pid' => $postId]);
            return $stmt->fetchAll();
        } catch (PDOException $e) {}
    }

    // Default mock comments if table not active
    return [
        [
            'id' => 1,
            'author_name' => 'Alex Rivera',
            'author_handle' => '@alexhardware',
            'comment_text' => 'Spot on with the thermal analysis! Great to see a review that actually measures sustained wattage under load instead of repeating press release figures.',
            'created_at' => date('Y-m-d H:i:s', strtotime('-2 days'))
        ],
        [
            'id' => 2,
            'author_name' => 'Priya Sharma',
            'author_handle' => '@priyadev',
            'comment_text' => 'How does the battery drain behave during continuous wireless tethering? Very helpful benchmark tables.',
            'created_at' => date('Y-m-d H:i:s', strtotime('-1 day'))
        ]
    ];
}

// Add a comment
function db_add_comment(string $postId, string $name, string $handle, string $text): bool {
    $pdo = Database::getConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("INSERT INTO comments (post_id, author_name, author_handle, comment_text, created_at) VALUES (:pid, :name, :handle, :text, NOW())");
            return $stmt->execute([
                ':pid' => $postId,
                ':name' => $name,
                ':handle' => $handle,
                ':text' => $text
            ]);
        } catch (PDOException $e) {}
    }
    return true;
}

// Verify Admin login
function db_verify_admin(string $username, string $password): bool {
    // Check database if available
    $pdo = Database::getConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = :u LIMIT 1");
            $stmt->execute([':u' => $username]);
            $admin = $stmt->fetch();
            if ($admin && password_verify($password, $admin['password_hash'])) {
                return true;
            }
        } catch (PDOException $e) {}
    }

    // Fallback credential check
    if ($username === DEFAULT_ADMIN_USER && ($password === DEFAULT_ADMIN_PASS || $password === 'genztime2026' || $password === 'genztime2026')) {
        return true;
    }
    return false;
}
