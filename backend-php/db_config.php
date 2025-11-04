<?php
// Arquivo: backend-php/db_config.php (ORDEM CORRIGIDA)

// 1. Configurações de Sessão PRIMEIRO
$cookie_lifetime = 60 * 60 * 24 * 7; // 7 dias
session_set_cookie_params($cookie_lifetime);

session_start(); // Inicia a sessão

// 2. TODOS OS CABEÇALHOS DE PERMISSÃO (CORS)
header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Access-Control-Allow-Credentials: true'); // <-- A linha crucial que estava faltando!

// 3. O 'exit' DO OPTIONS VEM DEPOIS DOS CABEÇALHOS
// Este bloco deve ser o ÚLTIMO antes da lógica do DB
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200); // Responde OK para o "aquecimento"
    exit(0); // Para a execução
}

// 4. Lógica do Banco de Dados
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