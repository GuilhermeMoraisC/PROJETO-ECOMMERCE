<?php
// Arquivo: backend-php/api/get-produtos.php
require_once '../db_config.php';

$sql = "SELECT id, nome, descricao, preco, imagem_path FROM produtos ORDER BY id DESC";
$result = $conn->query($sql);
$produtos = [];
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $row['imagem_url'] = "http://localhost/backend-php/uploads/" . $row['imagem_path'];
        $produtos[] = $row;
    }
}
$conn->close();
header('Content-Type: application/json');
echo json_encode($produtos);
?>
