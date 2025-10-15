<?php
// Arquivo: backend-php/api/admin/importar-csv.php

header('Content-Type: application/json');
require_once '../../db_config.php';

// --- (IMPORTANTE: No futuro, adicione aqui uma verificação para garantir que apenas o admin logado pode executar este script) ---

$response = ['success' => false, 'message' => 'Nenhum arquivo enviado.'];

// Verifica se um arquivo foi enviado e se não houve erro no upload
if (isset($_FILES['csvfile']) && $_FILES['csvfile']['error'] == 0) {
    
    $fileName = $_FILES['csvfile']['name'];
    $fileTmpPath = $_FILES['csvfile']['tmp_name'];

    // Pega a extensão do arquivo
    $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
    
    // Verifica se a extensão é 'csv'
    if (strtolower($fileExtension) === 'csv') {
        
        // Abre o arquivo temporário para leitura
        $handle = fopen($fileTmpPath, "r");
        
        if ($handle !== FALSE) {
            // Prepara a query de inserção para evitar SQL Injection
            $stmt = $conn->prepare("INSERT INTO produtos (nome, descricao, preco, imagem_path) VALUES (?, ?, ?, ?)");
            
            // Pula a primeira linha (cabeçalho da planilha: nome,descricao,etc.)
            fgetcsv($handle, 1000, ","); 
            
            $produtosImportados = 0;
            $erros = 0;

            // Loop para ler o arquivo linha por linha
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                // Certifica-se de que a linha tem o número correto de colunas (4)
                if (count($data) == 4) {
                    $nome = $data[0];
                    $descricao = $data[1];
                    $preco = (float) $data[2]; // Converte o preço para número
                    $imagem_path = $data[3];   // Ex: "meu-produto.jpg"

                    // Vincula os parâmetros e executa a query
                    $stmt->bind_param("ssds", $nome, $descricao, $preco, $imagem_path);
                    
                    if ($stmt->execute()) {
                        $produtosImportados++;
                    } else {
                        $erros++;
                    }
                } else {
                    $erros++; // Linha com formato incorreto
                }
            }
            
            $stmt->close();
            fclose($handle);

            $response = [
                'success' => true, 
                'message' => "Importação concluída! Produtos cadastrados: $produtosImportados. Linhas com erro: $erros."
            ];

        } else {
            $response['message'] = 'Não foi possível abrir o arquivo enviado.';
        }
    } else {
        $response['message'] = 'Formato de arquivo inválido. Por favor, envie um arquivo .csv';
    }
}

$conn->close();
echo json_encode($response);
?>