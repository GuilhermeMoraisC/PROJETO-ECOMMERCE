import React, { useState, useEffect } from 'react'; // 1. Garanta que 'useEffect' está importado
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componentes Globais
import Header from './components/Header';
import CategoryMenu from './components/CategoryMenu';
import CartSidebar from './components/CartSidebar';

// Páginas
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProductDetailPage from './pages/ProductDetailPage';
import ResetPasswordPage from './pages/ResetPasswordPage'; // Rota de reset
import Footer from './components/Footer';

// Importe o apiFetch do seu AuthContext
import { apiFetch } from './context/AuthContext';

function App() {
  // --- ESTADOS DO CARRINHO (EXISTENTES) ---
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const numeroFornecedor = "5531996809118"; // Pode manter aqui ou na Home

  // --- NOVOS ESTADOS PARA O FRETE ---
  const [cep, setCep] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState('');

  // --- NOVO: Limpa o frete se o carrinho mudar ---
  useEffect(() => {
    setSelectedShipping(null);
    setShippingOptions([]);
    setShippingError('');
    // Não limpa o CEP, o usuário pode querer reusar
  }, [cartItems]); // Dispara quando o carrinho muda


  // --- FUNÇÕES GLOBAIS DO CARRINHO ---

  // ATUALIZE ESTA FUNÇÃO
  const handleAddToCart = (product, quantityToAdd = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        // Mensagem atualizada para mostrar a quantidade
        toast.info(`${quantityToAdd}x ${product.nome} adicionado(s)!`);
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
        );
      } else {
        // Mensagem atualizada para mostrar a quantidade
        toast.success(`${quantityToAdd}x ${product.nome} adicionado(s) ao carrinho!`);
        return [...prevItems, { ...product, quantity: quantityToAdd }];
      }
    });
    setIsCartOpen(true);
  };

  const handleRemoveItem = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast.error('Produto removido.');
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // --- NOVA FUNÇÃO: CALCULAR FRETE ---
  const handleCalculateShipping = async () => {
    // Remove qualquer formatação do CEP (deixa só números)
    const cepLimpo = cep.replace(/\D/g, ''); 
    
    if (cepLimpo.length !== 8) { // CEPs no Brasil têm 8 dígitos
      setShippingError('CEP inválido. Digite 8 números.');
      return;
    }
    if (cartItems.length === 0) {
      setShippingError('Seu carrinho está vazio.');
      return;
    }

    setShippingLoading(true);
    setShippingError('');
    setShippingOptions([]);
    setSelectedShipping(null);

    try {
      // Usamos o apiFetch do seu AuthContext (que já lida com credenciais, se necessário)
      const response = await apiFetch('http://localhost/backend-php/api/calcular-frete.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cep: cepLimpo // Envia o CEP limpo
          // Não precisamos enviar "items" nesta versão simplificada
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Erro ao calcular o frete.');
      }

      setShippingOptions(data.options); // Ex: [{tipo: 'PAC', ...}, {tipo: 'SEDEX', ...}]

    } catch (err) {
      setShippingError(err.message);
    } finally {
      setShippingLoading(false);
    }
  };


  // --- ATUALIZADA: generateWhatsAppLink ---
  const generateWhatsAppLink = () => {
    if (cartItems.length === 0) {
      toast.error("Seu carrinho está vazio!");
      return;
    }
    
    // Validação de Frete
    if (shippingOptions.length > 0 && !selectedShipping) {
      toast.error("Por favor, selecione uma opção de frete.");
      return;
    }

    let mensagem = "Olá! Gostaria de fazer um pedido com os seguintes itens:\n\n";
    let subtotal = 0;

    cartItems.forEach(item => {
      const precoItem = parseFloat(item.preco) || 0;
      const quantidadeItem = parseInt(item.quantity) || 1;
      mensagem += `- ${quantidadeItem}x ${item.nome} (R$ ${precoItem.toFixed(2)} cada)\n`;
      subtotal += precoItem * quantidadeItem;
    });

    mensagem += `\n*Subtotal: R$ ${subtotal.toFixed(2)}*`;

    let totalGeral = subtotal;

    // Adiciona o frete na mensagem
    if (selectedShipping) {
      mensagem += `\n*Frete (${selectedShipping.tipo}): R$ ${selectedShipping.valor.toFixed(2)}*`;
      totalGeral += selectedShipping.valor;
    }

    mensagem += `\n\n*Total (com frete): R$ ${totalGeral.toFixed(2)}*`;
    
    // Adiciona o CEP se ele foi digitado
    if(cep) {
        mensagem += `\n\n*CEP para entrega: ${cep}*`;
    }

    const link = `https://wa.me/${numeroFornecedor}?text=${encodeURIComponent(mensagem)}`;
    window.open(link, '_blank');
  };

  // --- O ESTADO DA BUSCA TAMBÉM FICA AQUI ---
  const [searchTerm, setSearchTerm] = useState("");

  // --- NOVO ESTADO PARA CATEGORIA ---
  const [selectedCategory, setSelectedCategory] = useState(null); // null = "Todos"

  return (
    <BrowserRouter>
      {/* O Header agora é global e controla a busca */}
   {/* O Header agora é global e controla a busca */}
      <Header
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)} // <--- ALTERE AQUI (de onOpenCart para onCartClick)
        onSearch={setSearchTerm}
      />

      {/* RENDERIZA O NOVO MENU ABAIXO DO HEADER */}
      <CategoryMenu 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory} // Passa a função para atualizar o estado
      />
      <Routes>
        {/* Passamos o searchTerm e a função de adicionar para a HomePage */}
        <Route
          path="/"
          element={
            <HomePage 
              searchTerm={searchTerm} 
              selectedCategory={selectedCategory} // <-- Passe o estado aqui
              handleAddToCart={handleAddToCart} 
            />
          }
        />
        
        {/* Passamos a função de adicionar para a ProductDetailPage */}
        <Route
          path="/produto/:id"
          element={<ProductDetailPage handleAddToCart={handleAddToCart} />}
        />

        {/* Rotas de Admin (não precisam do carrinho) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} /> 
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* O Sidebar e o Toast tbm são globais */}
      <CartSidebar
        cartItems={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onRemove={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={generateWhatsAppLink}
        
        // --- Novas Props para Frete ---
        cep={cep}
        setCep={setCep}
        shippingOptions={shippingOptions}
        selectedShipping={selectedShipping}
        setSelectedShipping={setSelectedShipping}
        onCalculateShipping={handleCalculateShipping}
        shippingLoading={shippingLoading}
        shippingError={shippingError}
      />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
      />
      <Footer />
    </BrowserRouter>
  );
}

export default App;