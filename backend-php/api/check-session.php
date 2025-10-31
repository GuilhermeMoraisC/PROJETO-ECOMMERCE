<?php
// Arquivo: backend-php/api/check-session.php (NOVO)
require_once '../db_config.php'; // Para iniciar a sessão e obter os cabeçalhos CORS

$response = ['isLoggedIn' => false];

if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    $response = ['isLoggedIn' => true, 'username' => $_SESSION['username']];
}

header('Content-Type: application/json');
echo json_encode($response);
?>