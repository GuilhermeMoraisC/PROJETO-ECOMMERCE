// Arquivo: src/pages/AdminDashboard.js (VERSÃO FINAL COMPLETA E CORRIGIDA)
import React, { useState, useEffect } from 'react';
import { useAuth, apiFetch } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'; 

function AdminDashboard() {
  const [produtos, setProdutos] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [produtoEditando, setProdutoEditando] = useState(null); 

  // Estados para o formulário de NOVO PRODUTO
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState(null);
  const [categoriaId, setCategoriaId] = useState(''); // <--- NOVO ESTADO PARA O ID DA CATEGORIA
  
  // Estados para CATEGORIAS
  const [categorias, setCategorias] = useState([]); 

  // Estados para IMPORTAR CSV (mantidos)
  const [csvFile, setCsvFile] = useState(null); 
  const [mensagemCsv, setMensagemCsv] = useState(''); 

  // Estados para MUDAR SENHA (mantidos)
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados para mensagens de feedback
  const [mensagemProduto, setMensagemProduto] = useState('');
  const [mensagemSenha, setMensagemSenha] = useState('');
  const [mensagemCrud, setMensagemCrud] = useState(''); 

  // Hooks
  const auth = useAuth();
  const navigate = useNavigate();


  // FUNÇÃO DE BUSCA DE PRODUTOS
  const fetchProdutos = async () => {
    try {
      setMensagemCrud('Carregando produtos...');
      const response = await apiFetch('http://localhost/backend-php/api/get-produtos.php');
      if (!response.ok) {
        throw new Error('Não foi possível buscar os produtos. Status: ' + response.status);
      }
      const data = await response.json();
      setProdutos(data);
      setMensagemCrud('');
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setMensagemCrud(`Erro ao carregar produtos: ${error.message}`);
    }
  };

  // FUNÇÃO DE BUSCA DE CATEGORIAS (NOVA)
  const fetchCategorias = async () => {
    try {
      const response = await apiFetch('http://localhost/backend-php/api/admin/get-categorias.php');
      const data = await response.json();
      setCategorias(data);
      // Define a primeira categoria como padrão
      if (data.length > 0) {
          setCategoriaId(data[0].id);
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  // Carrega produtos e categorias na montagem
  useEffect(() => {
    fetchProdutos();
    fetchCategorias(); // <--- CHAMA FUNÇÃO DE CATEGORIAS
  }, []); 

  // Handler para Excluir Produto (D - Delete)
  const handleDelete = async (produtoId) => {
    if (!window.confirm(`Tem certeza que deseja deletar o produto ID ${produtoId}?`)) { return; }
    setMensagemCrud(`Deletando produto ID ${produtoId}...`);

    try {
      const response = await apiFetch('http://localhost/backend-php/api/admin/delete-produto.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: produtoId }),
      });
      const data = await response.json();
      if (data.success) {
        setMensagemCrud(data.message);
        setProdutos(produtos.filter(p => p.id !== produtoId));
      } else {
        setMensagemCrud(`Erro ao deletar: ${data.message}`);
      }
    } catch (error) {
      setMensagemCrud('Erro de conexão ao deletar produto.');
    }
  };

  // Handler para Abrir Edição (U - Update)
  const handleEdit = (produto) => {
    setProdutoEditando(produto);
    setIsModalOpen(true);
  };

  // Handler para Fechar Edição
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProdutoEditando(null);
    setMensagemCrud('');
    fetchProdutos();
  };

  // Função de Logout (mantida)
  const handleLogout = async () => {
    await auth.logout();
    navigate('/login');
  };

  // Função para Trocar Senha (mantida)
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setMensagemSenha('');
    if (newPassword.length < 6) { setMensagemSenha('Erro: A nova senha deve ter pelo menos 6 caracteres.'); return; }
    if (newPassword !== confirmPassword) { setMensagemSenha('Erro: As novas senhas não batem.'); return; }

    setMensagemSenha('Alterando...');
    try {
      const response = await apiFetch('http://localhost/backend-php/api/admin/change-password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      });
      const data = await response.json();
      if (response.ok) { 
        setMensagemSenha(`Sucesso: ${data.message}`);
        setOldPassword(''); setNewPassword(''); setConfirmPassword('');
      } else {
        setMensagemSenha(`Erro: ${data.message}`);
      }
    } catch (error) {
      setMensagemSenha('Erro de conexão.');
    }
  };

  // Handler de Novo Produto (C - Create) (ATUALIZADO PARA CATEGORIA)
  const handleProdutoSubmit = async (e) => {
    e.preventDefault();
    setMensagemProduto('Enviando...');
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('preco', preco);
    formData.append('categoria_id', categoriaId); // <--- NOVO: ENVIA CATEGORIA
    formData.append('imagem', imagem); 

    try {
      const response = await apiFetch('http://localhost/backend-php/api/admin/upload-produto.php', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setMensagemProduto(`Sucesso: ${data.message}`);
        e.target.reset(); 
        fetchProdutos(); 
      } else {
        setMensagemProduto(`Erro: ${data.message}`);
      }
    } catch (error) {
      setMensagemProduto('Erro de conexão. Verifique o console.');
    }
  };

  // Handler de Importação CSV (R - Read) (mantido)
  const handleCsvSubmit = async (e) => {
    e.preventDefault();
    if (!csvFile) {
        setMensagemCsv('Por favor, selecione um arquivo CSV.');
        return;
    }
    setMensagemCsv('Importando...');

    const formData = new FormData();
    formData.append('csvfile', csvFile); 

    try {
      const response = await apiFetch('http://localhost/backend-php/api/admin/importar-csv.php', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setMensagemCsv(`Sucesso: ${data.message}`);
        fetchProdutos(); 
      } else {
        setMensagemCsv(`Erro: ${data.message}`);
      }
      e.target.reset();
    } catch (error) {
      console.error('Erro na requisição:', error);
      setMensagemCsv('Erro de conexão. Verifique o console.');
    }
  };


  // --- ESTRUTURA VISUAL DO PAINEL ---

  return (
    <div className="container admin-dashboard">
      <div className="admin-header">
        <h2>Painel do Administrador</h2>
        <button onClick={handleLogout} className="btn-logout">Sair (Logout)</button>
      </div>

      <hr className="divider" />
      
      {/* --- Seção de LISTAGEM DE PRODUTOS --- */}
      <div className="form-section">
        <h3>Produtos Cadastrados ({produtos.length})</h3>
        {mensagemCrud && <p className="feedback-message">{mensagemCrud}</p>}

        <table className="products-table">
   <thead>
  <tr>
    <th>ID</th><th>Nome</th><th>Categoria</th><th>Preço</th><th>Imagem</th><th>Ações</th>
  </tr>
</thead>
         <tbody>
  {produtos.map(p => (
    <tr key={p.id}>
      <td>{p.id}</td>
      <td>{p.nome}</td>
      <td>{p.categoria_nome || 'N/A'}</td>
      <td>R$ {parseFloat(p.preco).toFixed(2)}</td>
      <td>
        <img src={p.imagem_url} alt={p.nome} className="product-thumb" />
      </td>
      <td>
        <button onClick={() => handleEdit(p)} className="btn-action btn-edit">Editar</button>
        <button onClick={() => handleDelete(p.id)} className="btn-action btn-delete">Excluir</button>
      </td>
    </tr>
  ))}
  {produtos.length === 0 && <tr><td colSpan="6">Nenhum produto cadastrado.</td></tr>}
</tbody>
        </table>
      </div>

      <hr className="divider" />

      {/* --- Seção de CADASTRO (C - Create) --- */}
      <div className="form-section">
        <h3>Cadastrar Novo Produto</h3>
        <form onSubmit={handleProdutoSubmit}>
          <div className="form-group"><label>Nome:</label><input type="text" onChange={(e) => setNome(e.target.value)} required /></div>
          <div className="form-group"><label>Descrição:</label><textarea onChange={(e) => setDescricao(e.target.value)} /></div>
          <div className="form-group"><label>Preço:</label><input type="number" step="0.01" onChange={(e) => setPreco(e.target.value)} required /></div>
          
          {/* CAMPO DE CATEGORIA (NOVO) */}
          <div className="form-group">
            <label>Categoria:</label>
            <select 
                value={categoriaId} 
                onChange={(e) => setCategoriaId(e.target.value)}
                required
            >
                {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>
                        {cat.nome}
                    </option>
                ))}
            </select>
          </div>
          
          <div className="form-group"><label>Imagem:</label><input type="file" onChange={(e) => setImagem(e.target.files[0])} accept="image/*" required /></div>
          <button type="submit" className="btn-submit">Salvar Produto</button>
        </form>
        {mensagemProduto && <p className="feedback-message">{mensagemProduto}</p>}
      </div>

      <hr className="divider" />

      {/* --- Seção de IMPORTAÇÃO CSV --- */}
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
            O arquivo CSV deve ter 4 colunas: 
            <code>nome</code>, <code>descricao</code>, <code>preco</code>, <code>imagem_path</code>
          </p>
          <button type="submit" className="btn-submit">Importar CSV</button>
        </form>
        {mensagemCsv && <p className="feedback-message">{mensagemCsv}</p>}
      </div>

      <hr className="divider" />
      
      {/* --- Seção de TROCA DE SENHA --- */}
      <div className="form-section">
        <h3>Alterar Senha</h3>
        <form onSubmit={handleChangePasswordSubmit}>
          <div className="form-group"><label>Senha Antiga:</label><input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required /></div>
          <div className="form-group"><label>Nova Senha:</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /></div>
          <div className="form-group"><label>Confirmar:</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></div>
          <button type="submit" className="btn-submit">Alterar Senha</button>
        </form>
        {mensagemSenha && <p className="feedback-message">{mensagemSenha}</p>}
      </div>
      
      {/* --- Modal de Edição (U - Update) --- */}
      {isModalOpen && (
        <ModalEdicao 
          produto={produtoEditando} 
          onClose={handleCloseModal} 
          apiFetch={apiFetch} 
          backendUrl={'http://localhost/backend-php/api/admin/update-produto.php'}
          categorias={categorias} // <--- PASSA AS CATEGORIAS PARA O MODAL
        />
      )}
    </div>
  );
}

export default AdminDashboard;


// --- Componente Modal de Edição (U - Update) ---
function ModalEdicao({ produto, onClose, apiFetch, backendUrl, categorias }) { // <--- RECEBE CATEGORIAS
    // Estados locais para o formulário do modal
    const [nome, setNome] = useState(produto.nome);
    const [descricao, setDescricao] = useState(produto.descricao);
    const [preco, setPreco] = useState(parseFloat(produto.preco).toFixed(2));
    const [categoriaId, setCategoriaId] = useState(produto.categoria_id || ''); // <--- NOVO ESTADO
    const [imagemNova, setImagemNova] = useState(null);
    const [mensagemModal, setMensagemModal] = useState('');

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        setMensagemModal('Atualizando...');

        const formData = new FormData();
        formData.append('id', produto.id);
        formData.append('nome', nome);
        formData.append('descricao', descricao);
        formData.append('preco', preco);
        formData.append('categoria_id', categoriaId); // <--- NOVO: ENVIA CATEGORIA
        formData.append('imagem_atual', produto.imagem_path); 

        if (imagemNova) {
            formData.append('imagem_nova', imagemNova);
        }

        try {
            const response = await apiFetch(backendUrl, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (data.success) {
                setMensagemModal(data.message);
                setTimeout(onClose, 1500); 
            } else {
                setMensagemModal(`Erro: ${data.message}`);
            }

        } catch (error) {
            setMensagemModal('Erro de conexão ao tentar editar produto.');
        }
    };


    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>Editar Produto: {produto.nome} (ID: {produto.id})</h3>
                <form onSubmit={handleModalSubmit}>
                    
                    <div className="form-group">
                        <label>Nome do Produto:</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Descrição:</label>
                        <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Preço:</label>
                        <input type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} required />
                    </div>
                    
                    {/* CAMPO DE CATEGORIA NO MODAL (NOVO) */}
                    <div className="form-group">
                        <label>Categoria:</label>
                        <select 
                            value={categoriaId} 
                            onChange={(e) => setCategoriaId(e.target.value)}
                            required
                        >
                            {categorias.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="current-image">
                        <label>Imagem Atual:</label>
                        <img src={produto.imagem_url} alt={produto.nome} className="product-thumb" />
                    </div>
                    
                    <div className="form-group">
                        <label>Nova Imagem (Opcional):</label>
                        <input type="file" onChange={(e) => setImagemNova(e.target.files[0])} accept="image/*" />
                    </div>

                    {mensagemModal && <p className="feedback-message">{mensagemModal}</p>}
                    
                    <div className="modal-actions">
                        <button type="submit" className="btn-submit">Salvar Alterações</button>
                        <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
                    </div>

                </form>
            </div>
        </div>
    );
}