<?php
// Arquivo: backend-php/db_config.php (FINAL)
ob_start(); // Inicia o buffer para evitar o erro "Headers already sent"

// --- 1. CONFIGURAÇÃO DA SESSÃO ---
$cookie_lifetime = 60 * 60 * 24 * 7; 
session_set_cookie_params($cookie_lifetime);
session_start(); 
// ---------------------------------

// --- 2. CONFIGURAÇÃO DE CORS (Headers de Acesso) ---
header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Access-Control-Allow-Credentials: true'); // ESSENCIAL PARA SESSÕES

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}
// ----------------------------------------------------

// --- 3. CONFIGURAÇÃO E CONEXÃO COM O BANCO DE DADOS ---
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', ''); 
define('DB_NAME', 'loja_fornecedor_db');

$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

if ($conn->connect_error) {
    header('Content-Type: application/json');
    die(json_encode(['success' => false, 'message' => 'Erro de conexão com o banco de dados: ' . $conn->connect_error]));
}
$conn->set_charset("utf8");
// REMOVIDA A TAG DE FECHAMENTO ?>