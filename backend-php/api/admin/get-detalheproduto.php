<?php
// Arquivo: backend-php/api/get-detalheproduto.php
require_once '../db_config.php'; // Inclui conexão com DB e headers CORS

$response = ['success' => false, 'message' => 'Produto não encontrado.'];

// 1. Pega o ID da URL (ex: ?id=9)
$produto_id = $_GET['id'] ?? 0;

if ($produto_id > 0) {
    
    // 2. Prepara a query (SELECT)
    $sql = "SELECT id, nome, descricao, preco, imagem_path FROM produtos WHERE id = ?";
    $stmt = $conn->prepare($sql);
    
    // 3. Executa a busca
    $stmt->bind_param("i", $produto_id);
    $stmt->execute();
    
    $result = $stmt->get_result();
    
    if ($result && $result->num_rows === 1) {
        $row = $result->fetch_assoc();
        
        // 4. Constrói a URL da imagem (usando o caminho corrigido)
        $row['imagem_url'] = "http://localhost/backend-php/uploads/" . $row['imagem_path'];
        
        $response = [
            'success' => true,
            'produto' => $row
        ];
    }
    
    $stmt->close();
}

$conn->close();
header('Content-Type: application/json');

// O front-end espera o objeto do produto. Se sucesso for true, usamos $response['produto'].
// Se falhar, retorna a mensagem de erro.
echo json_encode($response['success'] ? $response['produto'] : $response);
?>