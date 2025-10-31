// Arquivo: src/pages/LoginPage.js (NOVO)
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminDashboard.css'; // Reutilizando o CSS do admin para o formulário

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Para onde redirecionar após o login?
  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const success = await auth.login(username, password);
    
    if (success) {
      navigate(from, { replace: true }); // Redireciona para /admin
    } else {
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="container admin-dashboard" style={{ maxWidth: '500px' }}>
      <h2>Login - Painel Admin</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Usuário:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="feedback-message" style={{color: 'red'}}>{error}</p>}
        <button type="submit" className="btn-submit">Entrar</button>
      </form>
    </div>
  );
}

export default LoginPage;