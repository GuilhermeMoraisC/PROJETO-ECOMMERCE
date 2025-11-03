<?php
// Arquivo: backend-php/api/reset-senha.php (NOVO)
require_once '../db_config.php';

$response = ['success' => false, 'message' => 'O token é inválido ou expirou.'];
$data = json_decode(file_get_contents('php://input'), true);
$token = $data['token'] ?? '';
$new_password = $data['new_password'] ?? '';

if (empty($token) || empty($new_password) || strlen($new_password) < 6) {
    http_response_code(400);
    $response['message'] = 'Dados inválidos. A senha deve ter no mínimo 6 caracteres.';
    echo json_encode($response);
    exit;
}

// 1. Busca o token na tabela 'password_resets'
$sql = "
    SELECT u.id, r.expires_at 
    FROM password_resets r
    JOIN usuarios_admin u ON r.user_id = u.id
    WHERE r.token = ? AND r.used = 0
    ORDER BY r.expires_at DESC
    LIMIT 1
";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $row = $result->fetch_assoc();
    $user_id = $row['id'];
    $expires_at = $row['expires_at'];

    // 2. Verifica a validade (se o token expirou)
    if (strtotime($expires_at) > time()) {
        
        // 3. Token VÁLIDO: Cria o novo hash
        $novo_hash = password_hash($new_password, PASSWORD_DEFAULT);
        
        // 4. Atualiza a senha e marca o token como usado
        $conn->begin_transaction();
        
        $update_password = $conn->prepare("UPDATE usuarios_admin SET senha_hash = ? WHERE id = ?");
        $update_password->bind_param("si", $novo_hash, $user_id);
        
        $mark_used = $conn->prepare("UPDATE password_resets SET used = 1 WHERE token = ?");
        $mark_used->bind_param("s", $token);

        if ($update_password->execute() && $mark_used->execute()) {
            $conn->commit();
            $response = ['success' => true, 'message' => 'Senha redefinida com sucesso! Você pode logar.'];
        } else {
            $conn->rollback();
            $response['message'] = 'Erro ao salvar a nova senha no banco de dados.';
            http_response_code(500);
        }
        $update_password->close();
        $mark_used->close();

    } else {
        $response['message'] = 'O link de reset expirou. Solicite um novo.';
        http_response_code(401);
    }
} else {
    $response['message'] = 'Token inválido ou já foi usado.';
    http_response_code(401);
}

$stmt->close();
$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>