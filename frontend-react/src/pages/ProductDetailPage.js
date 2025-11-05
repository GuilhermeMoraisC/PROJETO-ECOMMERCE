// // Arquivo: src/pages/ProductDetailPage.js (FINALMENTE CORRIGIDO)
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// // import Header from '../components/Header'; // <-- REMOVIDO (agora é global)
// import './ProductDetailPage.css';

// // Recebe a função 'handleAddToCart' global do App.js
// function ProductDetailPage({ handleAddToCart }) {
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   const { id } = useParams();

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         const response = await fetch(`http://localhost/backend-php/api/get-detalheproduto.php?id=${id}`);
        
//         if (!response.ok) {
//           throw new Error(`Erro ${response.status}: Produto não encontrado.`);
//         }
        
//         const data = await response.json();
//         // Garante que o preço seja um número
//         setProduct({ ...data, preco: parseFloat(data.preco) || 0 });
        
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   // Renderiza estados de carregamento ou erro
//   if (loading) {
//     return (
//       // <Header /> // <-- REMOVIDO
//       <div className="container">Carregando...</div>
//     );
//   }
  
//   if (error) {
//     return (
//       // <Header /> // <-- REMOVIDO
//       <div className="container error-message">{error}</div>
//     );
//   }

//   if (!product) {
//     return (
//       // <Header /> // <-- REMOVIDO
//       <div className="container">Produto não encontrado.</div>
//     );
//   }

//   // Renderiza o produto
//   return (
//     <div className="product-detail-page">
//       {/* <Header /> // <-- REMOVIDO */}
      
//       <div className="container">
//         <div className="product-content">

//           {/* Coluna da Esquerda: Imagem */}
//           <div className="product-image-container">
//             <img src={product.imagem_url} alt={product.nome} className="product-image-large" />
//           </div>

//           {/* Coluna da Direita: Informações */}
//           <div className="product-info-container">
//             <h1 className="product-title">{product.nome}</h1>
            
//             <p className="product-price-large">R$ {product.preco.toFixed(2)}</p>
            
//             <h3 className="product-section-title">Descrição</h3>
//             <p className="product-description">{product.descricao}</p>
            
//             {/* --- CORREÇÃO DO BOTÃO --- */}
//             <button 
//               className="add-to-cart-btn-large"
//               // Chama a função global 'handleAddToCart' recebida via props
//               onClick={() => handleAddToCart(product)}
//             >
//               Adicionar ao Carrinho
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProductDetailPage;

// Arquivo: src/pages/ProductDetailPage.js (ATUALIZADO COM SELETOR DE QUANTIDADE)



// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import './ProductDetailPage.css';

// // Recebe a função 'handleAddToCart' global do App.js
// function ProductDetailPage({ handleAddToCart }) {
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [quantity, setQuantity] = useState(1); // <-- NOVO ESTADO para a quantidade
  
//   const { id } = useParams();

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         const response = await fetch(`http://localhost/backend-php/api/get-detalheproduto.php?id=${id}`);
        
//         if (!response.ok) {
//           throw new Error(`Erro ${response.status}: Produto não encontrado.`);
//         }
        
//         const data = await response.json();
//         setProduct({ ...data, preco: parseFloat(data.preco) || 0 });
        
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   // --- NOVAS FUNÇÕES para controlar a quantidade ---
//   const handleQuantityChange = (amount) => {
//     setQuantity(prev => Math.max(1, prev + amount)); // Garante que nunca seja menor que 1
//   };

//   const onQuantityInputChange = (e) => {
//     const value = parseInt(e.target.value, 10);
//     if (value >= 1) {
//       setQuantity(value);
//     } else if (e.target.value === '') {
//       setQuantity(1); // Reseta para 1 se o campo ficar vazio
//     }
//   };
//   // --- Fim das novas funções ---


//   if (loading) { /* ... (seu código de loading) ... */ }
//   if (error) { /* ... (seu código de erro) ... */ }
//   if (!product) { /* ... (seu código de produto não encontrado) ... */ }

//   // Renderiza o produto
//   return (
//     <div className="product-detail-page">
//       <div className="container">
//         <div className="product-content">

//           <div className="product-image-container">
//             <img src={product.imagem_url} alt={product.nome} className="product-image-large" />
//           </div>

//           <div className="product-info-container">
//             <h1 className="product-title">{product.nome}</h1>
            
//             <p className="product-price-large">R$ {product.preco.toFixed(2)}</p>
            
//             <h3 className="product-section-title">Descrição</h3>
//             <p className="product-description">{product.descricao}</p>
            
//             {/* --- NOVO SELETOR DE QUANTIDADE --- */}
//             <h3 className="product-section-title">Quantidade</h3>
//             <div className="quantity-selector">
//               <button 
//                 className="quantity-btn" 
//                 onClick={() => handleQuantityChange(-1)} 
//                 disabled={quantity <= 1}
//               >
//                 -
//               </button>
//               <input 
//                 type="number" 
//                 className="quantity-input" 
//                 value={quantity} 
//                 onChange={onQuantityInputChange}
//                 min="1"
//               />
//               <button 
//                 className="quantity-btn" 
//                 onClick={() => handleQuantityChange(1)}
//               >
//                 +
//               </button>
//             </div>
            
//             {/* --- BOTÃO ATUALIZADO --- */}
//             <button 
//               className="add-to-cart-btn-large"
//               // Passa o produto E a quantidade selecionada
//               onClick={() => handleAddToCart(product, quantity)}
//             >
//               Adicionar ao Carrinho
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProductDetailPage;

// Arquivo: src/pages/ProductDetailPage.js (VERSÃO CORRIGIDA E COMPLETA)
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetailPage.css';

// 1. Recebe a função 'handleAddToCart' que vem do App.js
function ProductDetailPage({ handleAddToCart }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // Estado para a quantidade
  
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost/backend-php/api/get-detalheproduto.php?id=${id}`);
        
        if (!response.ok) {
          // Se a resposta não for OK (ex: 404), lança um erro
          const data = await response.json();
          throw new Error(data.message || `Erro ${response.status}`);
        }
        
        const data = await response.json();
        
        // Se a resposta for OK, mas os dados forem 'null' ou não tiverem 'id'
        if (!data || data.id === undefined) { 
           throw new Error('Produto não encontrado.');
        }

        // Sucesso: define o produto
        setProduct({ ...data, preco: parseFloat(data.preco) || 0 });
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // --- Funções para controlar a quantidade ---
  const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, prev + amount)); // Garante que nunca seja menor que 1
  };

  const onQuantityInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1) {
      setQuantity(value);
    } else if (e.target.value === '') {
      setQuantity(1);
    }
  };

  // --- 2. CLÁUSULAS DE GUARDA (A CORREÇÃO) ---
  // A ordem importa!
  
  // Primeiro, o Loading
  if (loading) {
    return (
      <div className="container" style={{ padding: '40px' }}>
        Carregando...
      </div>
    );
  }
  
  // Segundo, o Erro
  if (error) {
    return (
      <div className="container error-message" style={{ padding: '40px' }}>
        Erro ao carregar produto: {error}
      </div>
    );
  }

  // Terceiro, o Produto Nulo
  // Se 'loading' for false e 'error' for null, mas 'product' ainda for 'null',
  // significa que o fetch terminou sem sucesso mas não gerou erro (caso de segurança).
  if (!product) {
    return (
      <div className="container" style={{ padding: '40px' }}>
        Produto não encontrado.
      </div>
    );
  }

  // --- 3. RENDERIZAÇÃO SEGURA ---
  // Se o código chegou até aqui, 'product' NÃO é nulo e pode ser usado.
  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-content">

          {/* Coluna da Esquerda: Imagem */}
          <div className="product-image-container">
            <img src={product.imagem_url} alt={product.nome} className="product-image-large" />
          </div>

          {/* Coluna da Direita: Informações */}
          <div className="product-info-container">
            <h1 className="product-title">{product.nome}</h1>
            
            <p className="product-price-large">R$ {product.preco.toFixed(2)}</p>
            
            <h3 className="product-section-title">Descrição</h3>
            <p className="product-description">{product.descricao}</p>
            
            {/* Seletor de Quantidade */}
            <h3 className="product-section-title">Quantidade</h3>
            <div className="quantity-selector">
              <button 
                className="quantity-btn" 
                onClick={() => handleQuantityChange(-1)} 
                disabled={quantity <= 1}
              >
                -
              </button>
              <input 
                type="number" 
                className="quantity-input" 
                value={quantity} 
                onChange={onQuantityInputChange}
                min="1"
              />
              <button 
                className="quantity-btn" 
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>
            
            {/* Botão de Adicionar */}
            <button 
              className="add-to-cart-btn-large"
              onClick={() => handleAddToCart(product, quantity)}
            >
              Adicionar ao Carrinho
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;