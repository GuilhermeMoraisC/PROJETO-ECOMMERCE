// // Arquivo: src/App.js (VERSÃO ATUALIZADA)
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import HomePage from './pages/HomePage';
// import AdminDashboard from './pages/AdminDashboard';
// import LoginPage from './pages/LoginPage'; // <--- IMPORTE A PÁGINA DE LOGIN
// import ProtectedRoute from './components/ProtectedRoute'; // <--- IMPORTE O "GUARDA"
// import ProductDetailPage from './pages/ProductDetailPage';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Rota para a Página Principal (Pública) */}
//         <Route path="/" element={<HomePage />} />

//         {/* Rota de Login (Pública) */}
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/produto/:id" element={<ProductDetailPage />} />
        
//         {/* Rota para o Painel do Administrador (Agora Protegida) */}
//         <Route 
//           path="/admin" 
//           element={
//             <ProtectedRoute>
//               <AdminDashboard />
//             </ProtectedRoute>
//           } 
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

// Arquivo: src/App.js (ATUALIZADO PARA GERENCIAR CARRINHO E CATEGORIAS)
import React, { useState } from 'react'; // 1. Garanta que 'useState' está importado
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componentes Globais
import Header from './components/Header';
import CategoryMenu from './components/CategoryMenu'; // <-- NOVO
import CartSidebar from './components/CartSidebar';

// Páginas
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProductDetailPage from './pages/ProductDetailPage';
import ResetPasswordPage from './pages/ResetPasswordPage'; // Rota de reset

function App() {
  // --- O ESTADO DO CARRINHO AGORA MORA AQUI ---
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const numeroFornecedor = "5531996809118"; // Pode manter aqui ou na Home

  // --- FUNÇÕES GLOBAIS DO CARRINHO ---

  // Função Pura de Adicionar (sem evento)
  // const handleAddToCart = (product) => {
  //   setCartItems(prevItems => {
  //     const existingItem = prevItems.find(item => item.id === product.id);

  //     if (existingItem) {
  //       toast.info(`Mais um ${product.nome} adicionado!`);
  //       return prevItems.map(item =>
  //         item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
  //       );
  //     } else {
  //       toast.success(`"${product.nome}" adicionado ao carrinho!`);
  //       return [...prevItems, { ...product, quantity: 1 }];
  //     }
  //   });
  //   setIsCartOpen(true);
  // };
  // Arquivo: src/App.js (Substitua a função handleAddToCart)
// ... (resto do seu código do App.js)

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

// ... (resto do seu código do App.js: handleRemoveItem, generateWhatsAppLink, return, etc.)

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

  const generateWhatsAppLink = () => {
    if (cartItems.length === 0) {
      toast.error("Seu carrinho está vazio!");
      return;
    }
    let mensagem = "Olá! Gostaria de fazer um pedido com os seguintes itens:\n\n";
    let total = 0;
    cartItems.forEach(item => {
      const precoItem = parseFloat(item.preco) || 0;
      const quantidadeItem = parseInt(item.quantity) || 1;
      mensagem += `- ${quantidadeItem}x ${item.nome} (R$ ${precoItem.toFixed(2)} cada)\n`;
      total += precoItem * quantidadeItem;
    });
    mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;
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
      <Header
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
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
      />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
      />
    </BrowserRouter>
  );
}

export default App;