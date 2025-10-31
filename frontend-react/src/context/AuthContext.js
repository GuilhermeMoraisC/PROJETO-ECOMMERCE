// Arquivo: src/context/AuthContext.js (ATUALIZADO)
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

// O 'fetch' precisa enviar credenciais (cookies de sessão)
// EXPORTE esta função para que outros componentes possam usá-la
export const apiFetch = (url, options = {}) => {
  options.credentials = 'include'; // Isso é MUITO IMPORTANTE!
  return fetch(url, options);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await apiFetch('http://localhost/backend-php/api/check-session.php');
        const data = await response.json();
        if (data.isLoggedIn) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Não foi possível checar a sessão", error);
      }
      setLoading(false);
    };
    checkLoginStatus();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await apiFetch('http://localhost/backend-php/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  // ATUALIZE A FUNÇÃO LOGOUT
  const logout = async () => {
    try {
      await apiFetch('http://localhost/backend-php/api/logout.php', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setIsAuthenticated(false); // Desloga o usuário no front-end de qualquer jeito
    }
  };

  if (loading) {
    return <div>Carregando...</div>; 
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);