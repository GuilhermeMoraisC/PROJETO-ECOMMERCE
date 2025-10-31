<?php
// Arquivo: backend-php/api/login.php (VERSÃO SEGURA ATUALIZADA)
require_once '../db_config.php'; // Para iniciar a sessão e obter os cabeçalhos CORS

$response = ['success' => false, 'message' => 'Credenciais inválidas.'];

// Lê os dados JSON enviados pelo React
$data = json_decode(file_get_contents('php://input'), true);

$username = $data['username'] ?? '';
$password_do_usuario = $data['password'] ?? ''; // Ex: '123456'

if (empty($username) || empty($password_do_usuario)) {
    http_response_code(400); // Bad Request
    $response['message'] = 'Usuário e senha são obrigatórios.';
    echo json_encode($response);
    exit;
}

// --- LÓGICA DE LOGIN SEGURA ---

// 1. Buscar o usuário no banco de dados
$stmt = $conn->prepare("SELECT senha_hash FROM usuarios_admin WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    // Usuário encontrado
    $user = $result->fetch_assoc();
    $hash_do_banco = $user['senha_hash']; // O hash que salvamos (ex: $2y$10$T...)

    // 2. Verificar se a senha bate com o hash
    if (password_verify($password_do_usuario, $hash_do_banco)) {
        
        // Sucesso! Senha correta.
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['username'] = $username;
        
        $response = ['success' => true];

    } else {
        // Falha: senha incorreta
        http_response_code(401); // Não Autorizado
    }
} else {
    // Falha: usuário não encontrado
    http_response_code(401); // Não Autorizado
}

$stmt->close();
$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>