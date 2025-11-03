<?php
// Arquivo: backend-php/api/admin/delete-produto.php (NOVO)
require_once '../../db_config.php'; 

// Proteção de Acesso
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401); 
    die(json_encode(['success' => false, 'message' => 'Acesso não autorizado.']));
}

// Lê os dados JSON (o ID)
$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? 0;

$response = ['success' => false, 'message' => 'ID de produto inválido.'];

if ($id > 0) {
    // 1. Busca o nome da imagem antes de deletar o registro
    $stmt_select = $conn->prepare("SELECT imagem_path FROM produtos WHERE id = ?");
    $stmt_select->bind_param("i", $id);
    $stmt_select->execute();
    $result = $stmt_select->get_result();
    $produto = $result->fetch_assoc();
    $stmt_select->close();

    if ($produto) {
        $imagem_path = $produto['imagem_path'];
        $uploadDir = '../../uploads/';
        $filePath = $uploadDir . $imagem_path;

        // 2. Deleta o registro do banco de dados
        $stmt_delete = $conn->prepare("DELETE FROM produtos WHERE id = ?");
        $stmt_delete->bind_param("i", $id);

        if ($stmt_delete->execute()) {
            
            // 3. Tenta deletar a imagem do servidor
            if (file_exists($filePath) && is_writable($filePath)) {
                unlink($filePath); // Deleta o arquivo
            } 
            // Não falhamos se a imagem já tiver sumido.
            
            $response = ['success' => true, 'message' => 'Produto deletado com sucesso.'];

        } else {
            http_response_code(500); 
            $response['message'] = 'Erro ao deletar produto do banco de dados.';
        }
        $stmt_delete->close();
    } else {
        $response['message'] = 'Produto não encontrado.';
    }
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
?>