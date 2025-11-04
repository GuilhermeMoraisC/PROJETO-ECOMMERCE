<?php
// Arquivo: backend-php/api/get-categorias.php (NOVO)
require_once '../../db_config.php';

// Prepara a query para buscar todas as categorias
$sql = "SELECT id, nome FROM categorias ORDER BY nome ASC";
$result = $conn->query($sql);

$categorias = [];

if ($result && $result->num_rows > 0) {
    // Loop e coleta os resultados
    while($row = $result->fetch_assoc()) {
        $categorias[] = $row;
    }
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($categorias); // Retorna a lista em JSON
?>