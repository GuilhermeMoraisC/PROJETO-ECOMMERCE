<?php
// Arquivo: backend-php/api/get-produto.php (NOVO)
require_once '../db_config.php'; // Inclui CORS, Sessão e Conexão DB

$response = null;

// 1. Verifica se um ID foi enviado na URL (ex: ...php?id=5)
if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    
    $product_id = (int)$_GET['id'];
    
    // 2. Prepara a query segura para buscar UM produto
    $stmt = $conn->prepare("SELECT id, nome, descricao, preco, imagem_path FROM produtos WHERE id = ?");
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result && $result->num_rows > 0) {
        // 3. Produto encontrado
        $produto = $result->fetch_assoc();
        
        // Adiciona a URL completa da imagem, igual ao get-produtos.php
        $produto['imagem_url'] = "http://localhost/backend-php/uploads/" . $produto['imagem_path'];
        
        $response = $produto; // Resposta é o objeto do produto
        
    } else {
        // 4. Produto não encontrado com esse ID
        http_response_code(404); // Not Found
        $response = ['success' => false, 'message' => 'Produto não encontrado.'];
    }
    $stmt->close();
    
} else {
    // 5. Nenhum ID foi fornecido na URL
    http_response_code(400); // Bad Request
    $response = ['success' => false, 'message' => 'ID de produto inválido ou não fornecido.'];
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
?>