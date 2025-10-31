<?php
// tempo de vida de vida do cookie de sessão 7 dias
$cookie_lifetime = 60 * 60 * 24 * 7; // 7 dias em segundos
session_set_cookie_params($cookie_lifetime);

// Arquivo: backend-php/db_config.php (ATUALIZADO)
session_start(); 
// Arquivo: backend-php/db_config.php
header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', ''); 
define('DB_NAME', 'loja_fornecedor_db');

$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Erro de conexão com o banco de dados: ' . $conn->connect_error]));
}
$conn->set_charset("utf8");
?>
