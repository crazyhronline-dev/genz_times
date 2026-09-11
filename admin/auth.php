<?php
/**
 * GenZ Time - Admin Authentication Helper
 */

require_once __DIR__ . '/../config/site.php';

function is_admin_logged_in(): bool {
    return !empty($_SESSION['genz_admin_logged_in']) && $_SESSION['genz_admin_logged_in'] === true;
}

function require_admin_auth(): void {
    if (!is_admin_logged_in()) {
        header('Location: ' . url('admin/login.php'));
        exit;
    }
}
