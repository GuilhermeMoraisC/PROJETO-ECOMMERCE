// Arquivo: src/pages/AdminDashboard.js (CORRIGIDO)
import React, { useState } from 'react';
import './AdminDashboard.css';

function AdminDashboard() {
    // Estados para o formulário de cadastro individual
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [imagem, setImagem] = useState(null);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // Estados para o formulário de importação
    const [csvFile, setCsvFile] = useState(null);
    const [importMessage, setImportMessage] = useState('');
    const [isImportError, setIsImportError] = useState(false);

    const handleIndividualSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('descricao', descricao);
        formData.append('preco', preco);
        formData.append('imagem', imagem);

        try {
            const response = await fetch('http://localhost/backend-php/api/admin/upload-produto.php', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (result.success) {
                setMessage('Produto cadastrado com sucesso!');
                setIsError(false);
                e.target.reset();
            } else {
                setMessage(`Erro: ${result.message}`);
                setIsError(true);
            }
        } catch (error) {
            setMessage('Erro de conexão com a API.');
            setIsError(true);
        }
    };

    const handleCsvSubmit = async (e) => {
        // ... (código da função de importação CSV, sem alterações)
        e.preventDefault();
        setImportMessage('');
        setIsImportError(false);
        if (!csvFile) {
            setImportMessage('Por favor, selecione um arquivo .csv para enviar.');
            setIsImportError(true);
            return;
        }
        const formData = new FormData();
        formData.append('csvfile', csvFile);
        try {
            const response = await fetch('http://localhost/backend-php/api/admin/importar-csv.php', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (result.success) {
                setImportMessage(result.message);
                setIsImportError(false);
            } else {
                setImportMessage(`Erro na importação: ${result.message}`);
                setIsImportError(true);
            }
        } catch (error) {
            setImportMessage('Erro de conexão com a API de importação.');
            setIsImportError(true);
        }
    };

    return (
        <div className="admin-container">
            <h2>Painel do Administrador</h2>

            {/* Formulário de Cadastro Individual AGORA COMPLETO */}
            <form className="admin-form" onSubmit={handleIndividualSubmit}>
                <h3>Cadastrar Produto Individualmente</h3>
                
                <div className="form-group">
                    <label>🏷️ Nome do Produto</label>
                    <input type="text" onChange={(e) => setNome(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>💬 Descrição</label>
                    <textarea onChange={(e) => setDescricao(e.target.value)}></textarea>
                </div>
                <div className="form-group">
                    <label>💰 Preço (ex: 29.99)</label>
                    <input type="number" step="0.01" onChange={(e) => setPreco(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>📸 Imagem do Produto</label>
                    <input type="file" onChange={(e) => setImagem(e.target.files[0])} required />
                </div>

                <button type="submit">Cadastrar Produto</button>
                {message && <p className={`message ${isError ? 'error' : 'success'}`}>{message}</p>}
            </form>

            <hr className="divider" />

            {/* Formulário de Importação em Massa */}
            <div className="admin-form">
                <h3>Importar Produtos em Massa (via CSV)</h3>
                <p className="instructions">
                    Envie um arquivo <strong>.csv</strong> com as colunas na seguinte ordem: <br />
                    <code>nome,descricao,preco,nome_da_imagem.jpg</code>
                </p>
                <form onSubmit={handleCsvSubmit}>
                    <div className="form-group">
                        <label>📂 Arquivo .csv</label>
                        <input 
                            type="file" 
                            accept=".csv" 
                            onChange={(e) => setCsvFile(e.target.files[0])} 
                            required 
                        />
                    </div>
                    <button type="submit">Importar Planilha</button>
                </form>
                {importMessage && <p className={`message ${isImportError ? 'error' : 'success'}`}>{importMessage}</p>}
            </div>
        </div>
    );
}

export default AdminDashboard;