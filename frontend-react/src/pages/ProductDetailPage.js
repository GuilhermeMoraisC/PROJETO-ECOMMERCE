// Arquivo: src/pages/ProductDetailPage.js (ATUALIZADO COM BREADCRUMBS E RELACIONADOS)
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // <-- Importe o Link
import ProductCard from '../components/ProductCard'; // <-- Importe o ProductCard
import './ProductDetailPage.css'; // <-- CSS que vamos atualizar

// Recebe a função 'handleAddToCart' global do App.js
function ProductDetailPage({ handleAddToCart }) {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]); // <-- NOVO estado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  const { id } = useParams();

  // Efeito principal para buscar o produto
  useEffect(() => {
    // Reseta os estados ao mudar de ID
    setLoading(true);
    setProduct(null);
    setRelatedProducts([]);
    setQuantity(1); // Reseta a quantidade

    const fetchProduct = async () => {
      try {
        setError(null);
        const response = await fetch(`http://localhost/backend-php/api/get-detalheproduto.php?id=${id}`);
        
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || `Erro ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || data.id === undefined) { 
           throw new Error('Produto não encontrado.');
        }

        setProduct({ ...data, preco: parseFloat(data.preco) || 0 });
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // Re-executa se o ID da URL mudar

  // NOVO EFEITO: Busca produtos relacionados DEPOIS que o produto principal for carregado
  useEffect(() => {
    if (product && product.categoria_id) {
      const fetchRelated = async () => {
        try {
          const response = await fetch(
            `http://localhost/backend-php/api/get-produtos-relacionados.php?categoria_id=${product.categoria_id}&excluir_id=${product.id}`
          );
          if (!response.ok) return;
          const data = await response.json();
          // Garante que os relacionados também tenham preço formatado
          const formattedData = data.map(p => ({
              ...p,
              preco: parseFloat(p.preco) || 0
          }));
          setRelatedProducts(formattedData);
        } catch (err) {
          console.error("Erro ao buscar relacionados:", err);
        }
      };
      
      fetchRelated();
    }
  }, [product]); // Re-executa se o 'product' mudar

  
  // Funções de quantidade
  const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, prev + amount)); 
  };

  const onQuantityInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1) {
      setQuantity(value);
    } else if (e.target.value === '') {
      setQuantity(1);
    }
  };
  
  // Guardas de renderização
  if (loading) {
    return <div className="container" style={{ padding: '40px' }}>Carregando...</div>;
  }
  if (error) {
    return <div className="container error-message" style={{ padding: '40px' }}>Erro: {error}</div>;
  }
  if (!product) {
    return <div className="container" style={{ padding: '40px' }}>Produto não encontrado.</div>;
  }

  // Função para adicionar relacionados ao carrinho (ProductCard espera o evento)
  const handleAddRelatedToCart = (event, relatedProduct) => {
    event.stopPropagation();
    event.preventDefault();
    handleAddToCart(relatedProduct, 1); // Adiciona 1 unidade do relacionado
  };

  // Renderização principal
  return (
    <div className="product-detail-page">
      <div className="container">
        
        {/* --- 1. BREADCRUMBS --- */}
        <nav className="breadcrumbs">
          <Link to="/">Home</Link>
          <span>/</span>
          {product.categoria_nome ? (
            <span className="breadcrumb-category">{product.categoria_nome}</span>
          ) : (
            <span>Produtos</span>
          )}
          <span>/</span>
          <span className="breadcrumb-active">{product.nome}</span>
        </nav>

        <div className="product-content">
          <div className="product-image-container">
            <img src={product.imagem_url} alt={product.nome} className="product-image-large" />
          </div>

          <div className="product-info-container">
            <h1 className="product-title">{product.nome}</h1>
            <p className="product-price-large">R$ {product.preco.toFixed(2)}</p>
            
           
            <h3 className="product-section-title">Quantidade</h3>
            <div className="quantity-selector">
              <button className="quantity-btn" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</button>
              <input type="number" className="quantity-input" value={quantity} onChange={onQuantityInputChange} min="1" />
              <button className="quantity-btn" onClick={() => handleQuantityChange(1)}>+</button>
            </div>
            
            <button 
              className="add-to-cart-btn-large"
              onClick={() => handleAddToCart(product, quantity)}
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
 <h3 className="product-section-title">Descrição</h3>
            <p className="product-description">{product.descricao || 'Sem descrição disponível.'}</p>
            
        {/* --- 2. PRODUTOS RELACIONADOS --- */}
        {relatedProducts.length > 0 && (
          <div className="related-products-container">
            <h1 className="related-title">Produtos relacionados</h1>
            {/* Reutilizando o .product-grid da HomePage.css */}
            <div className="product-grid related-grid"> 
              {relatedProducts.map(related => (
                <Link to={`/produto/${related.id}`} key={related.id} className="product-link-wrapper">
                  <ProductCard 
                    product={related} 
                    onAddToCart={(e) => handleAddRelatedToCart(e, related)} 
                  />
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProductDetailPage;