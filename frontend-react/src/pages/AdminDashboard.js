// Arquivo: src/pages/AdminDashboard.js (ATUALIZADO)
import React, { useState } from 'react';
import { useAuth, apiFetch } from '../context/AuthContext'; // <--- IMPORTE 'useAuth' e 'apiFetch'
import { useNavigate } from 'react-router-dom'; // <--- IMPORTE 'useNavigate'
import './AdminDashboard.css'; 

function AdminDashboard() {
  // Estados para o formulário de NOVO PRODUTO
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState(null);
  
  // Estado para o formulário de IMPORTAR CSV
  const [csvFile, setCsvFile] = useState(null);

  // Estados para o formulário de MUDAR SENHA (NOVO)
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados para mensagens de feedback
  const [mensagemProduto, setMensagemProduto] = useState('');
  const [mensagemCsv, setMensagemCsv] = useState('');
  const [mensagemSenha, setMensagemSenha] = useState(''); // (NOVO)

  // Hooks para Logout (NOVO)
  const auth = useAuth();
  const navigate = useNavigate();

  // Função de Logout (NOVO)
  const handleLogout = async () => {
    await auth.logout();
    navigate('/login'); // Redireciona para a tela de login
  };

  // Função para Trocar Senha (NOVO)
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setMensagemSenha('');

    // 1. Validação do front-end
    if (newPassword.length < 6) {
      setMensagemSenha('Erro: A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMensagemSenha('Erro: As novas senhas não batem.');
      return;
    }

    setMensagemSenha('Alterando...');

    // 2. Chamada da API
    try {
      const response = await apiFetch('http://localhost/backend-php/api/admin/change-password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          old_password: oldPassword, 
          new_password: newPassword 
        }),
      });

      const data = await response.json();

      if (response.ok) { // 'ok' significa status 200-299
        setMensagemSenha(`Sucesso: ${data.message}`);
        // Limpa os campos
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMensagemSenha(`Erro: ${data.message}`);
      }
    } catch (error) {
      console.error('Erro ao trocar senha:', error);
      setMensagemSenha('Erro de conexão. Verifique o console.');
    }
  };


  /**
   * Manipulador para o envio do formulário de NOVO PRODUTO
   */
  const handleProdutoSubmit = async (e) => {
    e.preventDefault();
    setMensagemProduto('Enviando...');
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('preco', preco);
    formData.append('imagem', imagem);

    try {
      // Use 'apiFetch' aqui também para garantir que as credenciais sejam enviadas!
      const response = await apiFetch('http://localhost/backend-php/api/admin/upload-produto.php', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setMensagemProduto(`Sucesso: ${data.message}`);
        e.target.reset(); 
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
    // ... (lógica do CSV)
    setMensagemCsv('Importando...');
    const formData = new FormData();
    formData.append('csvfile', csvFile); 

    try {
      // Use 'apiFetch' aqui também!
      const response = await apiFetch('http://localhost/backend-php/api/admin/importar-csv.php', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setMensagemCsv(`Sucesso: ${data.message}`);
      } else {
        setMensagemCsv(`Erro: ${data.message}`);
      }
      e.target.reset();
    } catch (error) {
      console.error('Erro na requisição:', error);
      setMensagemCsv('Erro de conexão. Verifique o console.');
    }
  };


  return (
    <div className="container admin-dashboard">
      <div className="admin-header">
        <h2>Painel do Administrador</h2>
        <button onClick={handleLogout} className="btn-logout">Sair (Logout)</button>
      </div>
      
      {/* --- Seção de Cadastro de Produto --- */}
      <div className="form-section">
        <h3>Cadastrar Novo Produto</h3>
        <form onSubmit={handleProdutoSubmit}>
          {/* ... (campos de nome, descricao, preco, imagem) ... */}
          <div className="form-group">
            <label>Nome do Produto:</label>
            <input type="text" onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Descrição:</label>
            <textarea onChange={(e) => setDescricao(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Preço (ex: 129.90):</label>
            <input type="number" step="0.01" onChange={(e) => setPreco(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Imagem do Produto:</label>
            <input type="file" onChange={(e) => setImagem(e.target.files[0])} accept="image/*" required />
          </div>
          <button type="submit" className="btn-submit">Salvar Produto</button>
        </form>
        {mensagemProduto && <p className="feedback-message">{mensagemProduto}</p>}
      </div>

      <hr className="divider" />

      {/* --- Seção de Importação de CSV --- */}
      <div className="form-section">
        <h3>Importar Produtos em Massa (via CSV)</h3>
        <form onSubmit={handleCsvSubmit}>
          {/* ... (campos do CSV) ... */}
           <div className="form-group">
            <label>Arquivo .csv:</label>
            <input type="file" onChange={(e) => setCsvFile(e.target.files[0])} accept=".csv" required />
          </div>
          <p className="instructions">
            O arquivo CSV deve ter 4 colunas, nesta ordem: 
            <code>nome</code>, <code>descricao</code>, <code>preco</code>, <code>imagem_path</code>
          </p>
          <button type="submit" className="btn-submit">Importar CSV</button>
        </form>
        {mensagemCsv && <p className="feedback-message">{mensagemCsv}</p>}
      </div>

      {/* --- Seção de Trocar Senha (NOVO) --- */}
      <hr className="divider" />
      <div className="form-section">
        <h3>Alterar Senha</h3>
        <form onSubmit={handleChangePasswordSubmit}>
          <div className="form-group">
            <label>Senha Antiga:</label>
            <input 
              type="password" 
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Nova Senha (mín. 6 caracteres):</label>
            <input 
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Confirmar Nova Senha:</label>
            <input 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn-submit">Alterar Senha</button>
        </form>
        {mensagemSenha && <p className="feedback-message">{mensagemSenha}</p>}
      </div>

    </div>
  );
}

export default AdminDashboard;