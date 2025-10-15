// Arquivo: src/components/HeroBanner.js
import React from 'react';
import './HeroBanner.css';

function HeroBanner() {
  return (
    <div className="hero-banner">
      <div className="container hero-content">
        {/* Lado Esquerdo: Textos */}
        <div className="hero-text">
          <h2>Procura um produto para vender?</h2>
          <p>Temos vários. Produtos importados e inovadores, com estoque no Brasil.</p>
          <button className="hero-cta">Ver produtos →</button>
        </div>

        {/* Lado Direito: Imagens */}
        <div className="hero-image-container">
          <img 
            src="/images/pessoa-principal.png" // TROQUE PELO NOME DA SUA IMAGEM PRINCIPAL
            alt="Apresentação de produtos" 
            className="hero-main-image"
          />
          {/* Imagens flutuantes */}
          <img src="/images/produto1.png" alt="Produto 1" className="floating-product product-1" />
          <img src="/images/produto2.png" alt="Produto 2" className="floating-product product-2" />
          <img src="/images/produto3.png" alt="Produto 3" className="floating-product product-3" />
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;