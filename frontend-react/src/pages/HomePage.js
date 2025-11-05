// // Arquivo: src/pages/HomePage.js (VERSÃO FINAL CORRIGIDA)
// import React, { useState, useEffect, useMemo } from 'react';
// import { Link } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify'; 
// import 'react-toastify/dist/ReactToastify.css';

// import Header from '../components/Header';
// import HeroBanner from '../components/HeroBanner';
// import ProductCard from '../components/ProductCard';
// import CartSidebar from '../components/CartSidebar'; 
// import './HomePage.css';

// function HomePage() {
//     const [products, setProducts] = useState([]);
//     const [cartItems, setCartItems] = useState([]); 
//     const [isCartOpen, setIsCartOpen] = useState(false); 
//     const [loading, setLoading] = useState(true); 
//     const [error, setError] = useState(null); 
//     const [searchTerm, setSearchTerm] = useState(""); // <-- Estado para a busca
//     const numeroFornecedor = "5531996809118"; 

//     useEffect(() => {
//         fetch('http://localhost/backend-php/api/get-produtos.php')
//             .then(response => {
//                 if (!response.ok) { 
//                     throw new Error(`Erro HTTP: ${response.status}`);
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 const produtosComNumero = data.map(p => ({ 
//                     ...p, 
//                     preco: parseFloat(p.preco) || 0 
//                 }));
//                 setProducts(produtosComNumero);
//                 setLoading(false); 
//             })
//             .catch(error => {
//                 console.error("Erro ao buscar produtos:", error);
//                 setError(error.message); 
//                 setLoading(false);
//             });
//     }, []);

//     // --- FILTRAGEM DOS PRODUTOS (COM useMemo) ---
//     const filteredProducts = useMemo(() => {
//         if (!searchTerm) {
//             return products; // Retorna todos se a busca estiver vazia
//         }
//         return products.filter(product => 
//             product.nome.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//     }, [products, searchTerm]); // Dependências


//     // --- LÓGICA DO CARRINHO (PREENCHIDA) ---

//     // Lógica de Adicionar ao Carrinho (com quantidade)
//     const handleAddToCart = (event, product) => {
//         event.stopPropagation(); 
//         event.preventDefault();

//         setCartItems(prevItems => {
//             const existingItem = prevItems.find(item => item.id === product.id);

//             if (existingItem) {
//                 toast.info(`Mais um ${product.nome} adicionado!`); 
//                 return prevItems.map(item =>
//                     item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
//                 );
//             } else {
//                 toast.success(`"${product.nome}" adicionado ao carrinho!`); 
//                 return [...prevItems, { ...product, quantity: 1 }];
//             }
//         });
        
//         setIsCartOpen(true);
//     };
    
//     // Funções de Gerenciar o Carrinho
//     const handleRemoveItem = (productId) => {
//         setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
//         toast.error('Produto removido.');
//     };

//     const handleUpdateQuantity = (productId, newQuantity) => {
//         if (newQuantity <= 0) {
//             handleRemoveItem(productId);
//             return;
//         }
//         setCartItems(prevItems =>
//             prevItems.map(item =>
//                 item.id === productId ? { ...item, quantity: newQuantity } : item
//             )
//         );
//     };

//     // Lógica do WhatsApp
//     const generateWhatsAppLink = () => {
//         if (cartItems.length === 0) {
//             toast.error("Seu carrinho está vazio!");
//             return;
//         }

//         let mensagem = "Olá! Gostaria de fazer um pedido com os seguintes itens:\n\n";
//         let total = 0;

//         cartItems.forEach(item => {
//             const precoItem = parseFloat(item.preco) || 0;
//             const quantidadeItem = parseInt(item.quantity) || 1;

//             mensagem += `- ${quantidadeItem}x ${item.nome} (R$ ${precoItem.toFixed(2)} cada)\n`;
//             total += precoItem * quantidadeItem;
//         });

//         mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;

//         const link = `https://wa.me/${numeroFornecedor}?text=${encodeURIComponent(mensagem)}`;
//         window.open(link, '_blank');
//     };

//     // --- FIM DA LÓGICA DO CARRINHO ---


//     // Função de renderização (ATUALIZADA PARA USAR A BUSCA)
//     const renderContent = () => {
//         if (loading) { return <p>Carregando produtos...</p>; }
//         if (error) { return <p>Erro ao carregar produtos: {error}</p>; }
        
//         // Usa a lista FILTRADA
//         if (filteredProducts.length === 0) { 
//             if (searchTerm) {
//                 return <p>Nenhum produto encontrado para "{searchTerm}".</p>;
//             }
//             return <p>Nenhum produto encontrado.</p>; 
//         }

//         // Mapeia a lista FILTRADA
//         return filteredProducts.map(product => (
//             <Link to={`/produto/${product.id}`} key={product.id} className="product-link-wrapper">
//                 <ProductCard 
//                     product={product} 
//                     onAddToCart={(e) => handleAddToCart(e, product)} 
//                 />
//             </Link>
//         ));
//     };

//     return (
//         <>
//             {/* --- CORREÇÃO DA BUSCA --- */}
//             <Header 
//                 cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} 
//                 onOpenCart={() => setIsCartOpen(true)}
//                 onSearch={setSearchTerm} // <-- Passa a função de busca
//             />
            
//             <HeroBanner />
//             <div className="container">
//                 <div className="page-header">
//                     <h2 className="page-title">Nossos Produtos</h2>
//                 </div>
//                 <main className="product-grid">
//                     {renderContent()}
//                 </main>
//             </div>
            
//             <CartSidebar
//                 cartItems={cartItems}
//                 isOpen={isCartOpen}
//                 onClose={() => setIsCartOpen(false)}
//                 onRemove={handleRemoveItem}
//                 onUpdateQuantity={handleUpdateQuantity}
//                 onCheckout={generateWhatsAppLink} 
//             />
//             <ToastContainer 
//                 position="top-right" 
//                 autoClose={2000} 
//                 hideProgressBar={false} 
//                 newestOnTop={false} 
//                 closeOnClick 
//             />
//         </>
//     );
// }

// export default HomePage;

// Arquivo: src/pages/HomePage.js (VERSÃO SIMPLIFICADA)
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify'; // <-- REMOVIDO (agora é global)
// import 'react-toastify/dist/ReactToastify.css';

// import Header from '../components/Header'; // <-- REMOVIDO (agora é global)
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
// import CartSidebar from '../components/CartSidebar'; // <-- REMOVIDO (agora é global)
import './HomePage.css';

// Recebe 'searchTerm' e 'handleAddToCart' (global) do App.js
function HomePage({ searchTerm, handleAddToCart }) { 
    const [products, setProducts] = useState([]);
    // const [cartItems, setCartItems] = useState([]); // <-- REMOVIDO
    // const [isCartOpen, setIsCartOpen] = useState(false); // <-- REMOVIDO
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    // const [searchTerm, setSearchTerm] = useState(""); // <-- REMOVIDO (agora é prop)
    // const numeroFornecedor = "5531996809118"; // <-- REMOVIDO (agora é global)

    useEffect(() => {
        fetch('http://localhost/backend-php/api/get-produtos.php')
            .then(response => {
                if (!response.ok) { 
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const produtosComNumero = data.map(p => ({ 
                    ...p, 
                    preco: parseFloat(p.preco) || 0 
                }));
                setProducts(produtosComNumero);
                setLoading(false); 
            })
            .catch(error => {
                console.error("Erro ao buscar produtos:", error);
                setError(error.message); 
                setLoading(false);
            });
    }, []);

    // --- FILTRAGEM DOS PRODUTOS (COM useMemo) ---
    // Agora usa o 'searchTerm' recebido via props
    const filteredProducts = useMemo(() => {
        if (!searchTerm) {
            return products;
        }
        return products.filter(product => 
            product.nome.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]); // Dependências


    // --- LÓGICA DO CARRINHO ---
    // Funções de carrinho REMOVIDAS (estão no App.js)

    // ESTA FUNÇÃO LOCAL é mantida para parar o clique no Link
    const onProductCardClick = (event, product) => {
        event.stopPropagation(); 
        event.preventDefault();
        handleAddToCart(product); // Chama a função global recebida por props
    };

    // Função de renderização (igual a antes)
    const renderContent = () => {
        if (loading) { return <p>Carregando produtos...</p>; }
        if (error) { return <p>Erro ao carregar produtos: {error}</p>; }
        
        if (filteredProducts.length === 0) { 
            if (searchTerm) {
                return <p>Nenhum produto encontrado para "{searchTerm}".</p>;
            }
            return <p>Nenhum produto encontrado.</p>; 
        }

        return filteredProducts.map(product => (
            <Link to={`/produto/${product.id}`} key={product.id} className="product-link-wrapper">
                <ProductCard 
                    product={product} 
                    // Passa a função local que lida com o evento
                    onAddToCart={(e) => onProductCardClick(e, product)} 
                />
            </Link>
        ));
    };

    return (
        <>
            {/* O Header foi REMOVIDO daqui */}
            
            <HeroBanner />
            <div className="container">
                <div className="page-header">
                    <h2 className="page-title">Nossos Produtos</h2>
                </div>
                <main className="product-grid">
                    {renderContent()}
                </main>
            </div>
            
            {/* O CartSidebar e o ToastContainer foram REMOVIDOS daqui */}
        </>
    );
}

export default HomePage;