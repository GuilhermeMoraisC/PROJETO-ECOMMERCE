<?php
// Arquivo: backend-php/api/get-categorias.php (NOVO)
require_once '../db_config.php';

$sql = "SELECT id, nome FROM categorias ORDER BY nome ASC";
$result = $conn->query($sql);
$categorias = [];
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $categorias[] = $row;
    }
}
$conn->close();
header('Content-Type: application/json');
echo json_encode($categorias);
?>