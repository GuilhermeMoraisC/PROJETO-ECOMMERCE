import React from 'react';
import './Header.js'; // Vamos criar este CSS a seguir

function Header() {
  return (
    <header className="app-header">
      <div className="container header-content">
        <h1 className="logo">4all</h1>
        {/* Futuramente, aqui podem entrar um campo de busca, ícones, etc. */}
      </div>
    </header>
  );
}

export default Header;