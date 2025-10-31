// Arquivo: src/pages/HomePage.js (VERSÃO CORRIGIDA)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import CartSidebar from '../components/CartSidebar'; 
import './HomePage.css';

function HomePage() {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]); 
    const [isCartOpen, setIsCartOpen] = useState(false); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const numeroFornecedor = "5531996809118"; 

    useEffect(() => {
        fetch('http://localhost/backend-php/api/get-produtos.php')
            .then(response => {
                if (!response.ok) { 
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // CORREÇÃO AQUI: Garante que o preço seja um número ou 0
                const produtosComNumero = data.map(p => ({ 
                    ...p, 
                    preco: parseFloat(p.preco) || 0 // <-- Se p.preco for null/undefined, vira 0
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

    // Lógica de Adicionar ao Carrinho (com quantidade)
    const handleAddToCart = (event, product) => {
        event.stopPropagation(); 
        event.preventDefault();

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                toast.info(`Mais um ${product.nome} adicionado!`); 
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                toast.success(`"${product.nome}" adicionado ao carrinho!`); 
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
        
        setIsCartOpen(true);
    };
    
    // Funções de Gerenciar o Carrinho
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

    // Lógica do WhatsApp (COM CORREÇÃO)
    const generateWhatsAppLink = () => {
        if (cartItems.length === 0) {
            toast.error("Seu carrinho está vazio!"); // Substitui o alert
            return;
        }

        let mensagem = "Olá! Gostaria de fazer um pedido com os seguintes itens:\n\n";
        let total = 0;

        cartItems.forEach(item => {
            // CORREÇÃO AQUI: Garante que o preço seja um número ou 0
            const precoItem = parseFloat(item.preco) || 0;
            const quantidadeItem = parseInt(item.quantity) || 1;

            mensagem += `- ${quantidadeItem}x ${item.nome} (R$ ${precoItem.toFixed(2)} cada)\n`;
            total += precoItem * quantidadeItem;
        });

        mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;

        const link = `https://wa.me/${numeroFornecedor}?text=${encodeURIComponent(mensagem)}`;
        window.open(link, '_blank');
    };

    // Função de renderização (mantida como a sua)
    const renderContent = () => {
        if (loading) { return <p>Carregando produtos...</p>; }
        if (error) { return <p>Erro ao carregar produtos: {error}</p>; }
        if (products.length === 0) { return <p>Nenhum produto encontrado.</p>; }

        return products.map(product => (
            <Link to={`/produto/${product.id}`} key={product.id} className="product-link-wrapper">
                <ProductCard 
                    product={product} 
                    onAddToCart={(e) => handleAddToCart(e, product)} 
                />
            </Link>
        ));
    };

    return (
        <>
            <Header 
                cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} 
                onOpenCart={() => setIsCartOpen(true)}
            />
            <HeroBanner />
            <div className="container">
                <div className="page-header">
                    <h2 className="page-title">Nossos Produtos</h2>
                </div>
                <main className="product-grid">
                    {renderContent()}
                </main>
            </div>
            
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
        </>
    );
}

export default HomePage;