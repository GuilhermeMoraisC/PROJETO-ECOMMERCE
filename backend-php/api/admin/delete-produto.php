<?php
// Arquivo: backend-php/api/admin/delete-produto.php (NOVO)
require_once '../../db_config.php'; // Inclui CORS, Sessão e Conexão DB

// 1. Verifica se o admin está logado
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401); // Não autorizado
    die(json_encode(['success' => false, 'message' => 'Acesso não autorizado.']));
}

$response = ['success' => false, 'message' => 'Erro: ID do produto não fornecido.'];

// 2. Pega o ID enviado no corpo (body) do JSON
// O seu JS envia: body: JSON.stringify({ id: produtoId })
$data = json_decode(file_get_contents('php://input'), true);
$produto_id = $data['id'] ?? null;

if ($produto_id && is_numeric($produto_id)) {
    
    // --- Etapa Bônus: Deletar a imagem do servidor ---
    // (Primeiro, buscamos o nome do arquivo de imagem antes de deletar o produto)
    $stmt_select = $conn->prepare("SELECT imagem_path FROM produtos WHERE id = ?");
    $stmt_select->bind_param("i", $produto_id);
    if ($stmt_select->execute()) {
        $result = $stmt_select->get_result();
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $imagem_path = $row['imagem_path'];
            
            // Se o arquivo existir na pasta uploads, delete-o
            $uploadDir = '../../uploads/';
            if (!empty($imagem_path) && file_exists($uploadDir . $imagem_path)) {
                unlink($uploadDir . $imagem_path);
            }
        }
    }
    $stmt_select->close();
    // --- Fim da Etapa Bônus ---

    // 3. Prepara o DELETE no banco de dados
    $stmt_delete = $conn->prepare("DELETE FROM produtos WHERE id = ?");
    $stmt_delete->bind_param("i", $produto_id);
    
    if ($stmt_delete->execute()) {
        $response = ['success' => true, 'message' => 'Produto deletado com sucesso!'];
    } else {
        $response['message'] = 'Erro ao deletar o produto do banco de dados.';
    }
    $stmt_delete->close();
    
} else {
     $response['message'] = 'ID de produto inválido.';
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
?>