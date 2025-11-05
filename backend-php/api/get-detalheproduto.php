<?php
// Arquivo: backend-php/api/get-detalheproduto.php (ATUALIZADO)
require_once '../db_config.php'; 

$response = null;
$product_id = $_GET['id'] ?? 0;

if (is_numeric($product_id) && $product_id > 0) {
    
    // ATUALIZAÇÃO: Usamos LEFT JOIN para buscar o nome da categoria
    $stmt = $conn->prepare(
        "SELECT 
            p.id, 
            p.nome, 
            p.descricao, 
            p.preco, 
            p.imagem_path, 
            p.categoria_id, 
            c.nome as categoria_nome 
        FROM 
            produtos p
        LEFT JOIN 
            categorias c ON p.categoria_id = c.id
        WHERE 
            p.id = ?"
    );
    
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result && $result->num_rows > 0) {
        $produto = $result->fetch_assoc();
        $produto['imagem_url'] = "http://localhost/backend-php/uploads/" . $produto['imagem_path'];
        $response = $produto; 
    } else {
        http_response_code(404);
        $response = ['success' => false, 'message' => 'Produto não encontrado.'];
    }
    $stmt->close();
    
} else {
    http_response_code(400); 
    $response = ['success' => false, 'message' => 'ID de produto inválido ou não fornecido.'];
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
?>