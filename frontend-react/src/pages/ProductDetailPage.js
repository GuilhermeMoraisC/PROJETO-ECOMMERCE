// Arquivo: src/pages/ProductDetailPage.js (NOVO)
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Hook para ler a URL (ex: /produto/:id)
import Header from '../components/Header'; // Reutilizando seu Header
import './ProductDetailPage.css'; // Vamos criar este CSS

function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 1. Pega o parâmetro 'id' da URL (definido no App.js)
  const { id } = useParams();

  useEffect(() => {
    // 2. Função para buscar o produto específico
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 3. Chama o novo script PHP
        const response = await fetch(`http://localhost/backend-php/api/get-detalheproduto.php?id=${id}`);
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: Produto não encontrado.`);
        }
        
        const data = await response.json();
        setProduct(data);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // Executa toda vez que o ID na URL mudar

  // 4. Renderiza estados de carregamento ou erro
  if (loading) {
    return (
      <>
        <Header />
        <div className="container">Carregando...</div>
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <Header />
        <div className="container error-message">{error}</div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="container">Produto não encontrado.</div>
      </>
    );
  }

  // 5. Renderiza o produto
  return (
    <div className="product-detail-page">
      <Header />
      
      <div className="container">
        <div className="product-content">

          {/* Coluna da Esquerda: Imagem */}
          <div className="product-image-container">
            <img src={product.imagem_url} alt={product.nome} className="product-image-large" />
          </div>

          {/* Coluna da Direita: Informações */}
          <div className="product-info-container">
            <h1 className="product-title">{product.nome}</h1>
            
            <p className="product-price-large">R$ {parseFloat(product.preco).toFixed(2)}</p>
            
            <h3 className="product-section-title">Descrição</h3>
            <p className="product-description">{product.descricao}</p>
            
            <button className="add-to-cart-btn-large">
              Adicionar ao Carrinho
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;