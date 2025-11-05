<?php
// Arquivo: backend-php/api/get-produtos-relacionados.php (NOVO)
require_once '../db_config.php';

$categoria_id = $_GET['categoria_id'] ?? 0;
$excluir_id = $_GET['excluir_id'] ?? 0;

$produtos = [];

if (is_numeric($categoria_id) && $categoria_id > 0) {
    
    // Busca 4 produtos da mesma categoria, excluindo o produto atual
    $stmt = $conn->prepare(
        "SELECT id, nome, preco, imagem_path, categoria_id 
        FROM produtos 
        WHERE categoria_id = ? AND id != ? 
        LIMIT 4"
    );
    $stmt->bind_param("ii", $categoria_id, $excluir_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $row['imagem_url'] = "http://localhost/backend-php/uploads/" . $row['imagem_path'];
            $produtos[] = $row;
        }
    }
    $stmt->close();
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($produtos);
?>