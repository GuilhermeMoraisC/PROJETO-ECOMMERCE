// Arquivo: src/components/Header.js (ATUALIZADO)
import React from 'react';
import './Header.css';

// Importa a imagem do logo da pasta 'images'
import logoImage from './images/logo.png'; 

function Header() {
  return (
    <header className="app-header">
      <div className="container header-content">
        
        {/* Novo contêiner para a Logo + Texto */}
        <div className="logo-container">
          
          {/* A imagem da logo */}
          <img 
            src={logoImage} 
            alt="Logo 4all" 
            className="logo-img" 
          />
          
          {/* O texto "4all" */}
          <h1 className="logo-text">4all</h1>
          
        </div>
        
        {/* Futuramente, aqui podem entrar um campo de busca, ícones, etc. */}
      </div>
    </header>
  );
}

export default Header;