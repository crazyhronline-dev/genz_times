<?php
/**
 * GenZ Time - Admin AJAX API Endpoint
 * Handles live Auto-SEO generation, Plagiarism scanning, and 1-click Humanizing.
 */

header('Content-Type: application/json');

require_once __DIR__ . '/../config/site.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../includes/seo-helper.php';
require_once __DIR__ . '/../includes/auto-seo-helper.php';
require_once __DIR__ . '/../includes/plagiarism-helper.php';

// Ensure admin is logged in
if (!is_admin_logged_in()) {
    echo json_encode(['error' => 'Unauthorized access']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$action = $input['action'] ?? '';

switch ($action) {
    case 'auto_seo':
        $title = $input['title'] ?? '';
        $category = $input['category'] ?? '';
        $content = $input['content'] ?? '';
        $specs = $input['specs'] ?? [];

        $result = generate_auto_seo($title, $category, $content, $specs);
        echo json_encode(['success' => true, 'data' => $result]);
        break;

    case 'check_plagiarism':
        $content = $input['content'] ?? '';
        $audit = check_plagiarism($content);
        echo json_encode(['success' => true, 'data' => $audit]);
        break;

    case 'humanize':
        $content = $input['content'] ?? '';
        $humanized = humanize_content($content);
        echo json_encode(['success' => true, 'data' => $humanized]);
        break;

    case 'check_seo':
        $title = $input['title'] ?? '';
        $excerpt = $input['excerpt'] ?? '';
        $content = $input['content'] ?? '';
        $focusKeyword = $input['focusKeyword'] ?? '';
        $metaTitle = $input['metaTitle'] ?? '';
        $metaDescription = $input['metaDescription'] ?? '';

        $audit = seo_calculate_score($title, $excerpt, $content, $focusKeyword, $metaTitle, $metaDescription);
        echo json_encode(['success' => true, 'data' => $audit]);
        break;

    default:
        echo json_encode(['error' => 'Unknown action: ' . $action]);
        break;
}
