// // Arquivo: src/components/HeroBanner.js (Carrossel Ativado)
// import React from 'react';
// import Slider from 'react-slick';
// import './HeroBanner.css';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

// // Importa as imagens manualmente (ou adicione/remova conforme necessário)
// import produto1 from './images/2056.png';
// import produto2 from './images/2056.png';
// import produto3 from './images/2056.png';
// import produto4 from './images/2056.png';
// import produto5 from './images/2056.png';

// function HeroBanner() {
//   // Array com as imagens do carrossel
//   const imagens = [produto1, produto2, produto3, produto4, produto5];
  
//   // Configurações do carrossel
//   const settings = {
//     dots: true,         // Mostra os pontinhos de navegação
//     infinite: true,     // Loop infinito
//     speed: 700,         // Velocidade da transição
//     slidesToShow: 1,    // 1 imagem por vez
//     slidesToScroll: 1,  // Passa 1 de cada vez
//     autoplay: true,     // Passa sozinho
//     autoplaySpeed: 3000, // Pausa de 3 segundos
//     arrows: false,      // Remove as setas laterais (opcional)
//     fade: true,         // Usa "fade" em vez de "slide" (opcional, fica bonito)
//     cssEase: 'linear'
//   };

//   return (
//     <div className="hero-banner">
//       <div className="container hero-content">
//         {/* Lado esquerdo (texto) foi REMOVIDO */}

//         {/* Lado direito: carrossel (agora ocupa 100%) */}
//         <div className="hero-image-container">
//           {/* O Slider foi DESCOMENTADO */}
//           <Slider {...settings}>
//             {imagens.map((img, index) => (
//               <div key={index} className="carousel-slide">
//                 <img src={img} alt={`Produto ${index + 1}`} className="carousel-image" />
//               </div>
//             ))}
//           </Slider>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default HeroBanner;

// Arquivo: src/components/HeroBanner.js (CORRIGIDO)
import React from 'react';
import Slider from 'react-slick';
import './HeroBanner.css';
// As importações de CSS do slick-carousel foram MOVIDAS para o index.js
import produto1 from './images/2056.png';
import produto2 from './images/unnamed (3).png';


function HeroBanner() {
  // Array com as imagens do carrossel
  const imagens = [produto1, produto2];
  
  // Configurações do carrossel
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: false,
    fade: true, // Efeito de fade
    cssEase: 'linear'
  };

  return (
    <div className="hero-banner">
      {/* A classe "container" foi REMOVIDA daqui para permitir 100% de largura */}
      <div className="hero-content">
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