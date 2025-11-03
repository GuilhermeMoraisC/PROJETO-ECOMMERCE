// Arquivo: src/pages/ResetPasswordPage.js (NOVO)
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../context/AuthContext';
import './AdminDashboard.css'; 

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token'); // Pega o token da URL
  const username = searchParams.get('user'); // Pega o usuário da URL

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  if (!token || !username) {
    return <div className="container" style={{paddingTop: '50px'}}>Link de reset inválido.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (newPassword.length < 6) {
      setMessage('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      return;
    }

    setMessage('Redefinindo senha...');

    try {
      const response = await apiFetch('http://localhost/backend-php/api/reset-senha.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`Sucesso! ${data.message}`);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setMessage(`Erro: ${data.message}`);
      }
    } catch (error) {
      setMessage('Erro de conexão ao servidor.');
    }
  };

  return (
    <div className="container admin-dashboard" style={{ maxWidth: '500px' }}>
      <h2>Redefinir Senha para {username}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nova Senha:</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Confirmar Nova Senha:</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        {message && <p className="feedback-message">{message}</p>}
        <button type="submit" className="btn-submit">Alterar Senha</button>
      </form>
      <p style={{marginTop: '20px', textAlign: 'center'}}>
         <button type="button" className="btn-link" onClick={() => navigate('/login')}>Ir para Login</button>
      </p>
    </div>
  );
}

export default ResetPasswordPage;