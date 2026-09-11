<?php
/**
 * GenZ Time - Site Configuration
 * Defines global constants, paths, and brand metadata.
 */

// Error reporting (set to 0 in strict production if desired)
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
ini_set('display_errors', '0');

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Site Details
define('SITE_NAME', 'GenZ Time');
define('SITE_TAGLINE', 'Next-Gen Hardware Intelligence, Gadget Benchmarks & Tech Lab');
define('SITE_DESCRIPTION', 'Independent next-gen tech hardware testing laboratory and publication covering flagship smartphones, custom silicon laptops, audiophile audio, spatial computing, VR headsets, and AI gadgets.');
define('SITE_AUTHOR', 'GenZ Editorial Team');
define('SITE_AUTHOR_ROLE', 'Lead Hardware Analyst & Tech Architect');
define('SITE_AUTHOR_AVATAR', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
define('SITE_AUTHOR_BIO', 'Gadget architects and tech journalists testing cutting-edge consumer hardware, custom silicon, and spatial devices.');
define('SITE_CONTACT_EMAIL', 'editorial@genztime.com');
define('SITE_TWITTER', '@GenZTimeTech');
define('SITE_YOUTUBE', 'https://youtube.com/@GenZTime');

// Auto-detect base URL (handles localhost:8000, subfolders, or shared hosting root domain)
if (!defined('BASE_URL')) {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443) ? 'https://' : 'http://';
    $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'localhost';
    
    // Determine script path relative to document root
    $scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
    // If inside /admin or /includes, get root dir
    $appDir = preg_replace('#/(admin|includes|config).*$#', '', $scriptDir);
    $appDir = rtrim($appDir, '/');
    
    define('BASE_URL', $protocol . $host . $appDir);
}

// Admin Credentials
define('DEFAULT_ADMIN_USER', 'admin');
define('DEFAULT_ADMIN_PASS', 'genztime2026');

// Database Configuration (Pre-configured for Hostinger & Localhost)
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'GenZTime');
define('DB_USER', getenv('DB_USER') ?: 'genztimeadmin');
define('DB_PASS', getenv('DB_PASS') ?: 'GenZTime@123#');

// Helper for asset URLs
function asset($path) {
    return BASE_URL . '/' . ltrim($path, '/');
}

// Helper for internal links
function url($path = '') {
    return BASE_URL . '/' . ltrim($path, '/');
}

// Clean output helper
function e($string) {
    return htmlspecialchars($string ?? '', ENT_QUOTES, 'UTF-8');
}
