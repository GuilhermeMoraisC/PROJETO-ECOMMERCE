<?php
// Arquivo: backend-php/api/admin/upload-produto.php (FINAL COM CATEGORIA)
require_once '../../db_config.php';

// --- Proteção de Admin ---
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401); 
    die(json_encode(['success' => false, 'message' => 'Acesso não autorizado. Faça login primeiro.']));
}

$nome = $_POST['nome'] ?? '';
$descricao = $_POST['descricao'] ?? '';
$preco = $_POST['preco'] ?? 0;
$categoria_id = $_POST['categoria_id'] ?? 0; // <--- NOVO: Pega o ID da categoria
$imagem = $_FILES['imagem'] ?? null;

$response = ['success' => false, 'message' => 'Erro: Dados incompletos ou inválidos.'];

// A validação agora inclui a categoria
if ($nome && $preco > 0 && $categoria_id > 0 && $imagem && $imagem['error'] == 0) {
    $uploadDir = '../../uploads/';
    $allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    $imageFileType = strtolower(pathinfo($imagem["name"], PATHINFO_EXTENSION));
    
    if (in_array($imageFileType, $allowedTypes)) {
        $imageFileName = uniqid('prod_') . '.' . $imageFileType;
        $uploadFile = $uploadDir . $imageFileName;

        if (move_uploaded_file($imagem['tmp_name'], $uploadFile)) {
            // SQL: INSERT INTO produtos (nome, descricao, preco, categoria_id, imagem_path) VALUES (?, ?, ?, ?, ?)
            $stmt = $conn->prepare("INSERT INTO produtos (nome, descricao, preco, categoria_id, imagem_path) VALUES (?, ?, ?, ?, ?)");
            
            // CORREÇÃO DE BIND_PARAM: ssdis
            $stmt->bind_param("ssdis", $nome, $descricao, $preco, $categoria_id, $imageFileName); 
            
            if ($stmt->execute()) {
                $response = ['success' => true, 'message' => 'Produto cadastrado com sucesso!'];
            } else {
                $response['message'] = 'Erro ao salvar informações no banco de dados.';
                unlink($uploadFile); 
            }
            $stmt->close();
        } else {
            $response['message'] = 'Erro ao realizar o upload da imagem.';
        }
    } else {
        $response['message'] = 'Tipo de arquivo não permitido.';
    }
}
$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
// REMOVIDA A TAG DE FECHAMENTO ?>