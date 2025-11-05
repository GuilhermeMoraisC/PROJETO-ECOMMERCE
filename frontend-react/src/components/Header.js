// Arquivo: src/components/Header.js (VERSÃO FINAL)
import React from 'react';
import './Header.css'; 
// Instale se ainda não o fez: npm install react-icons
import { FaShoppingCart, FaSearch } from 'react-icons/fa'; 

// O componente agora recebe 3 props: onSearch, cartItemCount, e onCartClick
function Header({ onSearch, cartItemCount, onCartClick }) {
  return (
    <header className="app-header">
      <div className="container header-content">
        <img className="logo-imagem"src='logo.png'></img>
        {/* <h1 className="logo">4ALL</h1> */}
        
        {/* Campo de Busca (do passo anterior) */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar produtos..."
            // Esta função deve ser implementada na HomePage e passada via prop
            onChange={(e) => onSearch(e.target.value)} 
          />
          <FaSearch className="search-icon" />
        </div>

        {/* ÍCONE DO CARRINHO: Onde a correção acontece */}
        <div 
          className="cart-icon-container" 
          onClick={onCartClick} // <--- ISTO ABRE O SIDEBAR
        > 
          <FaShoppingCart className="cart-icon" />
          {/* Badge de contagem */}
          {cartItemCount > 0 && (
            <span className="cart-badge">{cartItemCount}</span>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;