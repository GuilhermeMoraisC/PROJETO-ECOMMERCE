// Arquivo: frontend-react/src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom'; // Para links internos
import './Footer.css'; // Vamos criar este CSS

function Footer() {
  // Pegamos este número do seu App.js
  const whatsappNumber = "5531996809118";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Olá! Gostaria de tirar uma dúvida.")}`;

  return (
    <footer className="app-footer">
      <div className="container footer-content">
        
        {/* Coluna 1: Empresa */}
        <div className="footer-column">
          <h4>Empresa</h4>
          <ul>
            <li><Link to="/sobre">Sobre a 4ALL</Link></li>
            <li><Link to="/seguranca">Pagamento e segurança</Link></li>
            <li><Link to="/prazos">Prazos de Envio e Entrega</Link></li>
            <li><Link to="/termos">Termos de Uso</Link></li>
            <li><Link to="/trocas">Política de Trocas</Link></li>
            <li><Link to="/privacidade">Política de Privacidade</Link></li>
          </ul>
        </div>

        {/* Coluna 2: Ajuda */}
        <div className="footer-column">
          <h4>Ajuda</h4>
          <ul>
            <li><Link to="/login">Minha Conta</Link></li>
            <li><Link to="/contato">Contato</Link></li>
          </ul>
        </div>

        {/* Coluna 3: Siga */}
        <div className="footer-column">
          <h4>Siga</h4>
          <ul>
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer">Youtube</a></li>
          </ul>
        </div>

        {/* Coluna 4: Fale Conosco */}
        <div className="footer-column">
          <h4>Fale Conosco</h4>
          <p>
            <strong>Whatsapp SAC:</strong>
            <br />
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              (31) 99680-9118
            </a>
          </p>
        </div>
      </div>

      {/* Barra Inferior */}
      <div className="footer-bottom">
        <p>
          © 4ALL - Todos os direitos reservados 2025.
          <br />
          EMPRESA FICTÍCIA LTDA – CNPJ: 00.000.000/0001-00
        </p>
      </div>
    </footer>
  );
}

export default Footer;