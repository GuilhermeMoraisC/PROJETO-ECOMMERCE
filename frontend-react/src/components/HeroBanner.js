import React from 'react';
import Slider from 'react-slick';
import './HeroBanner.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Importa as imagens manualmente (ou adicione/remova conforme necessário)
import produto1 from './images/produto1.jpg';
import produto2 from './images//produto2.jpg';
import produto3 from './images//produto3.jpg';
import produto4 from './images//produto4.jpg';
import produto5 from './images//produto5.jpg';

function HeroBanner() {
  // Array com as imagens do carrossel
  const imagens = [produto1, produto2, produto3, produto4, produto5];
<img src={produto1 }/>
  // Configurações do carrossel
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
  };

  return (
    <div className="hero-banner">
      <div className="container hero-content">
        {/* Lado esquerdo: texto */}
        <div className="hero-text">
          <h2>Procura um produto para vender?</h2>
          <p>Temos vários. Produtos importados e inovadores, com estoque no Brasil.</p>
          <button className="hero-cta">Ver produtos →</button>
        </div>

        {/* Lado direito: carrossel */}
        <div className="hero-image-container">
          <Slider {...settings}>
            {imagens.map((img, index) => (
              <div key={index} className="carousel-slide">
                <img src={img} alt={`Produto ${index + 1}`} className="carousel-image" />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;