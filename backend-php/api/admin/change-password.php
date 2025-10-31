<?php
// Arquivo: backend-php/api/admin/change-password.php (NOVO)
require_once '../../db_config.php'; // Inicia sessão e conecta ao DB

// 1. VERIFICA SE O ADMIN ESTÁ LOGADO
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401); // Não autorizado
    die(json_encode(['success' => false, 'message' => 'Acesso não autorizado.']));
}

// 2. LÊ OS DADOS ENVIADOS PELO REACT
$data = json_decode(file_get_contents('php://input'), true);
$old_password = $data['old_password'] ?? '';
$new_password = $data['new_password'] ?? '';
$username = $_SESSION['username']; // Pega o usuário da sessão

$response = ['success' => false, 'message' => 'Erro desconhecido.'];

// 3. VALIDAÇÃO BÁSICA
if (strlen($new_password) < 6) {
    http_response_code(400); // Bad Request
    $response['message'] = 'A nova senha deve ter pelo menos 6 caracteres.';
    echo json_encode($response);
    exit;
}

// 4. BUSCA O HASH ATUAL NO BANCO
$stmt = $conn->prepare("SELECT senha_hash FROM usuarios_admin WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    $hash_do_banco = $user['senha_hash'];

    // 5. VERIFICA SE A SENHA ANTIGA BATE
    if (password_verify($old_password, $hash_do_banco)) {
        
        // 6. SENHA ANTIGA CORRETA: CRIA O NOVO HASH E ATUALIZA O BANCO
        $novo_hash = password_hash($new_password, PASSWORD_DEFAULT);
        
        $update_stmt = $conn->prepare("UPDATE usuarios_admin SET senha_hash = ? WHERE username = ?");
        $update_stmt->bind_param("ss", $novo_hash, $username);
        
        if ($update_stmt->execute()) {
            $response = ['success' => true, 'message' => 'Senha alterada com sucesso!'];
        } else {
            http_response_code(500); // Erro de servidor
            $response['message'] = 'Erro ao atualizar a senha no banco de dados.';
        }
        $update_stmt->close();

    } else {
        // Falha: senha antiga incorreta
        http_response_code(401); // Não Autorizado
        $response['message'] = 'A senha antiga está incorreta.';
    }
} else {
    http_response_code(404); // Não encontrado
    $response['message'] = 'Usuário da sessão não encontrado no banco.';
}

$stmt->close();
$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>