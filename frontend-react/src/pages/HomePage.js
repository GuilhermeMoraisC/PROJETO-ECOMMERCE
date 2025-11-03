// Arquivo: src/pages/HomePage.js (VERSÃO FINAL COMPLETA)
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import CartSidebar from '../components/CartSidebar'; 
import './HomePage.css'; 

function HomePage() {
  const [todosProdutos, setTodosProdutos] = useState([]); // Lista COMPLETA (Para busca)
  const [produtosExibidos, setProdutosExibidos] = useState([]); // Lista FILTRADA (Para exibir)
  const [carrinho, setCarrinho] = useState([]); 
  const [erro, setErro] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false); 

  // Calcula o número total de itens no carrinho
  const cartItemCount = carrinho.reduce((acc, item) => acc + item.quantity, 0); 

  // 1. Lógica de Busca de Produtos (Executado na montagem)
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch('http://localhost/backend-php/api/get-produtos.php');
        
        // Se a resposta não for JSON (erro de PHP), lança o erro.
        if (!response.ok) {
          throw new Error('Falha ao buscar produtos');
        }
        
        const data = await response.json();
        
        // Garante que o preço é um número antes de salvar
        const produtosTratados = data.map(p => ({
            ...p,
            preco: parseFloat(p.preco) || 0
        }));

        setTodosProdutos(produtosTratados); 
        setProdutosExibidos(produtosTratados);
      } catch (err) {
        setErro('Erro ao buscar produtos: ' + err.message);
      }
    };
    fetchProdutos();
  }, []); 


  // 2. Lógica de Busca (Recebe o termo do Header)
  const handleSearch = (searchTerm) => {
    const termo = searchTerm.toLowerCase();
    
    if (termo === '') {
      setProdutosExibidos(todosProdutos);
      return;
    }

    // Filtra a lista COMPLETA
    const resultados = todosProdutos.filter(produto => 
      produto.nome.toLowerCase().includes(termo) ||
      produto.descricao.toLowerCase().includes(termo)
    );

    setProdutosExibidos(resultados);
  };


  // 3. Lógica de Adicionar ao Carrinho (Para ProductCard)
  const handleAddToCart = (product) => {
    setCarrinho(prevCart => {
        const itemExistente = prevCart.find(item => item.id === product.id);

        if (itemExistente) {
            return prevCart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            // Garante que o preço seja tratado como float antes de adicionar
            const precoFloat = parseFloat(product.preco) || 0;
            return [...prevCart, { ...product, quantity: 1, preco: precoFloat }];
        }
    });
    setIsCartOpen(true); // Abre o sidebar ao adicionar
  };

  // Funções de manipulação do CartSidebar
  const handleRemoveItem = (id) => {
    setCarrinho(prevCart => prevCart.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
        handleRemoveItem(id);
        return;
    }
    setCarrinho(prevCart => prevCart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  const handleCheckout = () => {
    // Lógica completa para WhatsApp
    if (carrinho.length === 0) return;
    const itensMsg = carrinho.map(item => 
        `${item.quantity}x ${item.nome} (R$ ${(item.preco * item.quantity).toFixed(2)})`
    ).join('\n');
    const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantity, 0);
    const mensagem = `Olá! Gostaria de fazer o seguinte pedido:\n\n${itensMsg}\n\nTotal do Pedido: R$ ${total.toFixed(2)}\n\nAguardo o pagamento e a confirmação.`;
    const numeroWhatsApp = "5500000000000"; 
    const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };


  // 4. Lógica de Agrupamento por Categoria (para carrosséis/seções)
  const groupProdutosByCategoria = (produtos) => {
    return produtos.reduce((grupos, produto) => {
      // Usa o nome retornado pelo PHP
      const categoria = produto.categoria_nome || 'Sem Categoria'; 
      if (!grupos[categoria]) {
        grupos[categoria] = [];
      }
      grupos[categoria].push(produto);
      return grupos;
    }, {});
  };

  const produtosAgrupados = groupProdutosByCategoria(produtosExibidos);
  const categoriasKeys = Object.keys(produtosAgrupados);


  return (
    <div className="homepage">
      {/* Header */}
      <Header 
        onSearch={handleSearch} 
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
      /> 
      
      <HeroBanner />

      <main className="container">
        <h2>Catálogo de Produtos</h2>
        
        {/* Exibição de Erro */}
        {erro && <p style={{color: 'red'}}>{erro}</p>}

        {/* Renderiza as seções por Categoria */}
        {categoriasKeys.length > 0 ? (
          categoriasKeys.map(categoriaNome => (
            <div key={categoriaNome} className="category-section">
              <h3>{categoriaNome}</h3>
                <div className="product-grid">
                  {produtosAgrupados[categoriaNome].map(produto => (
                    <ProductCard 
                      key={produto.id} 
                      product={produto} 
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
            </div>
          ))
        ) : (
          !erro && <p>Nenhum produto cadastrado.</p>
        )}
      </main>

      {/* Sidebar do Carrinho */}
      <CartSidebar 
        cartItems={carrinho}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onRemove={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

export default HomePage;