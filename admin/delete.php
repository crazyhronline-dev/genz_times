<?php
/**
 * GenZ Time - Delete Review Handler
 */

require_once __DIR__ . '/../config/site.php';
require_once __DIR__ . '/../includes/db-helper.php';
require_once __DIR__ . '/auth.php';

require_admin_auth();

$id = trim($_GET['id'] ?? '');
if (!empty($id)) {
    db_delete_post($id);
}

header('Location: ' . url('admin/index.php?msg=deleted'));
exit;
