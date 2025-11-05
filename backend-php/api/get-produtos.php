<?php
// Arquivo: backend-php/api/get-produtos.php (CORRIGIDO)
require_once '../db_config.php';

// SQL ATUALIZADO: Faz um LEFT JOIN para buscar os dados da categoria
$sql = "
    SELECT 
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
    ORDER BY 
        p.id DESC
";

$result = $conn->query($sql);
$produtos = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Padronizando a URL da imagem (removendo "projeto-fornecedor")
        $row['imagem_url'] = "http://localhost/backend-php/uploads/" . $row['imagem_path'];
        $produtos[] = $row;
    }
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($produtos);
?>