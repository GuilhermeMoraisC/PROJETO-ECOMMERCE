<?php
// Arquivo: backend-php/api/admin/update-produto.php (NOVO)
require_once '../../db_config.php'; // Inclui CORS, Sessão e Conexão DB

// 1. Verifica se o admin está logado
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401); // Não autorizado
    die(json_encode(['success' => false, 'message' => 'Acesso não autorizado.']));
}

$response = ['success' => false, 'message' => 'Erro: Dados incompletos.'];

// 2. Recebe dados do FormData (via $_POST)
$produto_id = $_POST['id'] ?? null;
$nome = $_POST['nome'] ?? '';
$descricao = $_POST['descricao'] ?? '';
$preco = $_POST['preco'] ?? 0;
$categoria_id = $_POST['categoria_id'] ?? null;
$imagem_atual_path = $_POST['imagem_atual'] ?? ''; // Nome do arquivo atual (ex: prod_123.jpg)

// 3. Verifica se uma nova imagem foi enviada
$imagem_nova = $_FILES['imagem_nova'] ?? null;
$imageFileName = $imagem_atual_path; // Assume que manteremos a imagem atual

$uploadDir = '../../uploads/';

if ($produto_id && $nome && $preco > 0 && $categoria_id) {

    // --- LÓGICA DE UPLOAD DA NOVA IMAGEM (se existir) ---
    if ($imagem_nova && $imagem_nova['error'] == 0) {
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $imageFileType = strtolower(pathinfo($imagem_nova["name"], PATHINFO_EXTENSION));
        
        if (in_array($imageFileType, $allowedTypes)) {
            $newImageFileName = uniqid('prod_') . '.' . $imageFileType;
            $uploadFile = $uploadDir . $newImageFileName;

            if (move_uploaded_file($imagem_nova['tmp_name'], $uploadFile)) {
                // Se o upload da nova imagem deu certo, marcamos para deletar a antiga
                $imageFileName = $newImageFileName; // Este será salvo no DB
                
                // Deleta a imagem antiga, se ela existir
                if (!empty($imagem_atual_path) && file_exists($uploadDir . $imagem_atual_path)) {
                    unlink($uploadDir . $imagem_atual_path);
                }
            } else {
                $response['message'] = 'Erro ao mover a nova imagem.';
                echo json_encode($response);
                exit;
            }
        } else {
            $response['message'] = 'Tipo de arquivo não permitido.';
            echo json_encode($response);
            exit;
        }
    }
    // --- Fim da lógica de UPLOAD ---

    // 4. Prepara o UPDATE no banco de dados
    $stmt = $conn->prepare("UPDATE produtos SET nome = ?, descricao = ?, preco = ?, categoria_id = ?, imagem_path = ? WHERE id = ?");
    // "ssdssi" -> string, string, double, string, string, integer
    $stmt->bind_param("ssdisi", $nome, $descricao, $preco, $categoria_id, $imageFileName, $produto_id);
    
    if ($stmt->execute()) {
        $response = ['success' => true, 'message' => 'Produto atualizado com sucesso!'];
    } else {
        $response['message'] = 'Erro ao atualizar o banco de dados.';
    }
    $stmt->close();
    
} else {
     $response['message'] = 'Dados obrigatórios (ID, Nome, Preço, Categoria) não foram enviados.';
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
?>