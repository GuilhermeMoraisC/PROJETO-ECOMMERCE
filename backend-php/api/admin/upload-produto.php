<?php
// Arquivo: backend-php/api/admin/upload-produto.php (CORRIGIDO)
require_once '../../db_config.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401); 
    die(json_encode(['success' => false, 'message' => 'Acesso não autorizado.']));
}

$nome = $_POST['nome'] ?? '';
$descricao = $_POST['descricao'] ?? '';
$preco = $_POST['preco'] ?? 0;
$categoria_id = $_POST['categoria_id'] ?? null; // <-- RECEBE A CATEGORIA
$imagem = $_FILES['imagem'] ?? null;

$response = ['success' => false, 'message' => 'Erro: Dados incompletos ou inválidos.'];

// Adiciona $categoria_id à verificação
if ($nome && $preco > 0 && $categoria_id && $imagem && $imagem['error'] == 0) {
    $uploadDir = '../../uploads/';
    $allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    $imageFileType = strtolower(pathinfo($imagem["name"], PATHINFO_EXTENSION));
    
    if (in_array($imageFileType, $allowedTypes)) {
        $imageFileName = uniqid('prod_') . '.' . $imageFileType;
        $uploadFile = $uploadDir . $imageFileName;

        if (move_uploaded_file($imagem['tmp_name'], $uploadFile)) {
            // ATUALIZA O SQL para incluir categoria_id
            $stmt = $conn->prepare("INSERT INTO produtos (nome, descricao, preco, imagem_path, categoria_id) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("ssdsi", $nome, $descricao, $preco, $imageFileName, $categoria_id);
            
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
?>