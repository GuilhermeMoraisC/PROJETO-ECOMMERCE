<?php
// Arquivo: backend-php/api/admin/update-produto.php (NOVO)
require_once '../../db_config.php';

// Proteção de Acesso
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401); 
    die(json_encode(['success' => false, 'message' => 'Acesso não autorizado.']));
}

$id = $_POST['id'] ?? 0;
$nome = $_POST['nome'] ?? '';
$descricao = $_POST['descricao'] ?? '';
$preco = $_POST['preco'] ?? 0;
$imagem_nova = $_FILES['imagem_nova'] ?? null; // A imagem é opcional na edição

$response = ['success' => false, 'message' => 'Erro: Dados incompletos ou inválidos.'];

if ($id > 0 && $nome && $preco > 0) {
    
    $imageFileName = $_POST['imagem_atual'] ?? ''; // Pega o nome do arquivo atual, se não tiver upload novo

    // --- LÓGICA DE UPLOAD DE NOVA IMAGEM (OPCIONAL) ---
    if ($imagem_nova && $imagem_nova['error'] == 0) {
        $uploadDir = '../../uploads/';
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $imageFileType = strtolower(pathinfo($imagem_nova["name"], PATHINFO_EXTENSION));
        
        if (in_array($imageFileType, $allowedTypes)) {
            $newImageFileName = uniqid('prod_') . '.' . $imageFileType;
            $uploadFile = $uploadDir . $newImageFileName;

            if (move_uploaded_file($imagem_nova['tmp_name'], $uploadFile)) {
                // Sucesso no upload da nova imagem
                $imageFileName = $newImageFileName;
                
                // Opcional: Deletar a imagem antiga (boa prática)
                if (!empty($_POST['imagem_atual'])) {
                    $oldFilePath = $uploadDir . $_POST['imagem_atual'];
                    if (file_exists($oldFilePath)) {
                        unlink($oldFilePath); 
                    }
                }

            } else {
                $response['message'] = 'Erro ao realizar o upload da nova imagem.';
                echo json_encode($response);
                exit;
            }
        } else {
            $response['message'] = 'Tipo de arquivo de imagem não permitido.';
            echo json_encode($response);
            exit;
        }
    }
    
    // --- ATUALIZAÇÃO NO BANCO DE DADOS ---
    $stmt = $conn->prepare("UPDATE produtos SET nome = ?, descricao = ?, preco = ?, imagem_path = ? WHERE id = ?");
    $stmt->bind_param("ssdsi", $nome, $descricao, $preco, $imageFileName, $id);
    
    if ($stmt->execute()) {
        $response = ['success' => true, 'message' => 'Produto atualizado com sucesso!', 'imagem_path' => $imageFileName];
    } else {
        http_response_code(500);
        $response['message'] = 'Erro ao salvar informações no banco de dados.';
    }
    $stmt->close();
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
?>