// Arquivo: src/pages/AdminDashboard.js
import React, { useState } from 'react';
import './AdminDashboard.css'; // Vamos usar o CSS que você já criou

function AdminDashboard() {
  // Estado para o formulário de NOVO PRODUTO
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState(null);
  
  // Estado para o formulário de IMPORTAR CSV
  const [csvFile, setCsvFile] = useState(null);

  // Estado para mensagens de feedback
  const [mensagemProduto, setMensagemProduto] = useState('');
  const [mensagemCsv, setMensagemCsv] = useState('');

  /**
   * Manipulador para o envio do formulário de NOVO PRODUTO
   */
  const handleProdutoSubmit = async (e) => {
    e.preventDefault();
    setMensagemProduto('Enviando...'); // Feedback imediato

    // 1. Criar o FormData
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('preco', preco);
    formData.append('imagem', imagem); // O arquivo em si

    // 2. Enviar para o script PHP de upload
    try {
      const response = await fetch('http://localhost/projeto-fornecedor/backend-php/api/admin/upload-produto.php', {
        method: 'POST',
        body: formData,
        // Não defina 'Content-Type' aqui, o 'fetch' faz isso
        // automaticamente para 'multipart/form-data'
      });

      const data = await response.json();

      if (data.success) {
        setMensagemProduto(`Sucesso: ${data.message}`);
        // Limpar o formulário
        setNome('');
        setDescricao('');
        setPreco('');
        setImagem(null);
        e.target.reset(); // Reseta o input de arquivo
      } else {
        setMensagemProduto(`Erro: ${data.message}`);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setMensagemProduto('Erro de conexão. Verifique o console.');
    }
  };

  /**
   * Manipulador para o envio do formulário de IMPORTAR CSV
   */
  const handleCsvSubmit = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      setMensagemCsv('Por favor, selecione um arquivo CSV.');
      return;
    }
    setMensagemCsv('Importando...');

    // 1. Criar o FormData
    const formData = new FormData();
    formData.append('csvfile', csvFile); // O nome 'csvfile' deve bater com o esperado no PHP

    // 2. Enviar para o script PHP de importação
    try {
      const response = await fetch('http://localhost/projeto-fornecedor/backend-php/api/admin/importar-csv.php', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMensagemCsv(`Sucesso: ${data.message}`);
      } else {
        setMensagemCsv(`Erro: ${data.message}`);
      }
      e.target.reset(); // Reseta o input de arquivo
    } catch (error) {
      console.error('Erro na requisição:', error);
      setMensagemCsv('Erro de conexão. Verifique o console.');
    }
  };


  return (
    <div className="container admin-dashboard">
      <h2>Painel do Administrador</h2>
      
      {/* --- Seção de Cadastro de Produto --- */}
      <div className="form-section">
        <h3>Cadastrar Novo Produto</h3>
        <form onSubmit={handleProdutoSubmit}>
          <div className="form-group">
            <label>Nome do Produto:</label>
            <input 
              type="text" 
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Descrição:</label>
            <textarea 
              value={descricao} 
              onChange={(e) => setDescricao(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Preço (ex: 129.90):</label>
            <input 
              type="number" 
              step="0.01" 
              value={preco} 
              onChange={(e) => setPreco(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Imagem do Produto:</label>
            <input 
              type="file" 
              onChange={(e) => setImagem(e.target.files[0])} 
              accept="image/*" 
              required 
            />
          </div>
          
          <button type="submit" className="btn-submit">Salvar Produto</button>
        </form>
        {mensagemProduto && <p className="feedback-message">{mensagemProduto}</p>}
      </div>

      {/* --- Divisor --- */}
      <hr className="divider" />

      {/* --- Seção de Importação de CSV --- */}
      <div className="form-section">
        <h3>Importar Produtos em Massa (via CSV)</h3>
        <form onSubmit={handleCsvSubmit}>
          <div className="form-group">
            <label>Arquivo .csv:</label>
            <input 
              type="file" 
              onChange={(e) => setCsvFile(e.target.files[0])} 
              accept=".csv" 
              required 
            />
          </div>
          <p className="instructions">
            O arquivo CSV deve ter 4 colunas, nesta ordem: 
            <code>nome</code>, <code>descricao</code>, <code>preco</code>, <code>imagem_path</code>
            (A primeira linha/cabeçalho será ignorada).
          </p>
          <button type="submit" className="btn-submit">Importar CSV</button>
        </form>
        {mensagemCsv && <p className="feedback-message">{mensagemCsv}</p>}
      </div>

    </div>
  );
}

export default AdminDashboard;