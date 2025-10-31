// Arquivo: src/components/Header.js (ATUALIZADO)
import React from 'react';
import './Header.css';
import logoImage from './images/logo.png';

// Recebe as novas props 'cartCount' e 'onOpenCart'
function Header({ cartCount, onOpenCart }) { 
  return (
    <header className="app-header">
      <div className="container header-content">
        
        <div className="logo-container">
          <img 
            src={logoImage} 
            alt="Logo 4all" 
            className="logo-img" 
          />
          <h1 className="logo-text">4all</h1>
        </div>
        
        {/* NOVO: Botão/Ícone do Carrinho */}
        <button className="cart-icon-btn" onClick={onOpenCart}>
            🛒 Carrinho ({cartCount || 0}) 
        </button>

      </div>
    </header>
  );
}

export default Header;