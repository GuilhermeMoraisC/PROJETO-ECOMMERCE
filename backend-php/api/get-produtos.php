<?php
// Arquivo: backend-php/api/get-produtos.php (FINAL COM CATEGORIAS)
require_once '../db_config.php';

// Faz um JOIN para pegar o nome da categoria
$sql = "
    SELECT 
        p.id, p.nome, p.descricao, p.preco, p.imagem_path, 
        c.nome AS categoria_nome, c.id AS categoria_id 
    FROM produtos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    ORDER BY p.id DESC
";
$result = $conn->query($sql);
$produtos = [];
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // CORREÇÃO: Removido o caminho extra 'projeto-fornecedor/' da URL
        $row['imagem_url'] = "http://localhost/backend-php/uploads/" . $row['imagem_path'];
        $produtos[] = $row;
    }
}
$conn->close();
header('Content-Type: application/json');
echo json_encode($produtos);
// REMOVIDA A TAG DE FECHAMENTO ?>