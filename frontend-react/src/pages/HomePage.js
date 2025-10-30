// Arquivo: src/pages/HomePage.js (CORRIGIDO)
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

function HomePage() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const numeroFornecedor = "5511999998888"; // Coleque seu número aqui

    useEffect(() => {
        fetch('http://localhost/projeto-fornecedor/backend-php/api/get-produtos.php')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error("Erro ao buscar produtos:", error));
    }, []);

    const handleAddToCart = (product) => {
        setCart(prevCart => [...prevCart, product]);
        alert(`${product.nome} adicionado ao carrinho!`);
    };
    
    const generateWhatsAppLink = () => {
        if (cart.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        let mensagem = "Olá! Gostaria de fazer um pedido com os seguintes itens:\n\n";
        let total = 0;

        cart.forEach(item => {
            mensagem += `- ${item.nome} (R$ ${item.preco})\n`;
            total += parseFloat(item.preco);
        });

        mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;

        // A variável 'numeroFornecedor' é usada aqui
        const link = `https://wa.me/${numeroFornecedor}?text=${encodeURIComponent(mensagem)}`;
        window.open(link, '_blank');
    };

    return (
        <>
            <Header />
            <HeroBanner />
            
            <div className="container">
                <div className="page-header">
                    <h2 className="page-title">Nossos Produtos</h2>
                    <button className="whatsapp-button" onClick={generateWhatsAppLink}>
                        Finalizar Pedido ({cart.length})
                    </button>
                </div>
                <main className="product-grid">
                    {products.length > 0 ? (
                        products.map(product => (
                            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                        ))
                    ) : (
                        <p>Carregando produtos ou nenhum produto encontrado...</p>
                    )}
                </main>
            </div>
        </>
    );
}

export default HomePage;