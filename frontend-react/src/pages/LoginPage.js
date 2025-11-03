// Arquivo: src/pages/LoginPage.js (ATUALIZADO)
import React, { useState } from 'react';
import { useAuth, apiFetch } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminDashboard.css'; 

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isResetMode, setIsResetMode] = useState(false); // NOVO: Controla a tela de reset
  
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await auth.login(username, password);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Usuário ou senha inválidos.');
    }
  };

  if (isResetMode) {
    return <PasswordResetRequest setIsResetMode={setIsResetMode} />;
  }

  return (
    <div className="container admin-dashboard" style={{ maxWidth: '500px' }}>
      <h2>Login - Painel Admin</h2>
      <form onSubmit={handleLoginSubmit}>
        {/* ... (Campos de Usuário e Senha) ... */}
        <div className="form-group">
          <label>Usuário:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Senha:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="feedback-message" style={{color: 'red'}}>{error}</p>}
        <button type="submit" className="btn-submit">Entrar</button>
      </form>
      
      {/* NOVO LINK DE RECUPERAÇÃO */}
      <p style={{marginTop: '20px', textAlign: 'center'}}>
        <button type="button" className="btn-link" onClick={() => setIsResetMode(true)}>Esqueci minha senha</button>
      </p>
    </div>
  );
}

// NOVO COMPONENTE: Formulário de Solicitação de Reset
function PasswordResetRequest({ setIsResetMode }) {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Enviando solicitação...');
        
        try {
            const response = await apiFetch('http://localhost/backend-php/api/solicitar-reset.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });
            const data = await response.json();
            
            // O backend sempre retorna sucesso por segurança, para não revelar se o usuário existe
            setMessage(data.message); 

        } catch (error) {
            setMessage('Erro de conexão ao solicitar reset.');
        }
    };

    return (
        <div className="container admin-dashboard" style={{ maxWidth: '500px' }}>
            <h2>Recuperar Senha</h2>
            <p>Informe seu nome de usuário. O link de reset será gerado no log do back-end.</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Usuário:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                {message && <p className="feedback-message">{message}</p>}
                <button type="submit" className="btn-submit">Solicitar Link</button>
            </form>
            <p style={{marginTop: '20px', textAlign: 'center'}}>
                <button type="button" className="btn-link" onClick={() => setIsResetMode(false)}>← Voltar para Login</button>
            </p>
        </div>
    );
}

export default LoginPage;