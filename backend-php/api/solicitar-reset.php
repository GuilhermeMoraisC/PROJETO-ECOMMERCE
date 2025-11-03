<?php
// Arquivo: backend-php/api/solicitar-reset.php (NOVO)
require_once '../db_config.php';

$response = ['success' => false, 'message' => 'Erro interno.'];
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';

if (empty($username)) {
    http_response_code(400);
    $response['message'] = 'Nome de usuário obrigatório.';
    echo json_encode($response);
    exit;
}

// 1. Gera um token único e define a expiração (1 hora)
$token = bin2hex(random_bytes(16)); // Token de 32 caracteres hexadecimais
$expires = date("Y-m-d H:i:s", time() + 3600); // Expira em 1 hora

// 2. Busca o usuário no banco
$stmt_select = $conn->prepare("SELECT id FROM usuarios_admin WHERE username = ?");
$stmt_select->bind_param("s", $username);
$stmt_select->execute();
$result = $stmt_select->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    $user_id = $user['id'];

    // 3. Salva o token na tabela (a ser criada: 'password_resets')
    
    // ATENÇÃO: Se a tabela 'password_resets' não existir, este comando falhará!
    // Você deve criar a tabela primeiro (veja o Passo 4).
    $stmt_insert = $conn->prepare("INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)");
    $stmt_insert->bind_param("iss", $user_id, $token, $expires);
    
    if ($stmt_insert->execute()) {
        
        // 4. SIMULAÇÃO DE E-MAIL: Gera o link que o usuário deve receber
        $reset_link = "http://localhost:3000/reset-senha?token=$token&user=$username";
        
        // Em um sistema real, você enviaria este link por e-mail.
        // Aqui, nós o imprimimos em um LOG DE SIMULAÇÃO (que você pode verificar depois).
        $log_message = date("[Y-m-d H:i:s]") . " - LINK DE RESET GERADO PARA {$username}: {$reset_link}\n";
        file_put_contents('reset_log.txt', $log_message, FILE_APPEND);
        
        $response = [
            'success' => true,
            'message' => 'Se o usuário estiver cadastrado, um link de reset foi enviado (verifique o arquivo reset_log.txt no back-end).'
        ];

    } else {
        $response['message'] = 'Erro ao salvar o token de reset no banco.';
        http_response_code(500);
    }
    $stmt_insert->close();
} else {
    // É uma prática de segurança não revelar se o usuário existe
    $response['success'] = true;
    $response['message'] = 'Se o usuário estiver cadastrado, um link de reset foi enviado.';
}

$stmt_select->close();
$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>