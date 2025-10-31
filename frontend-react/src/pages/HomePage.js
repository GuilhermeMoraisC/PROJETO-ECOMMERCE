// Arquivo: src/pages/HomePage.js (ATUALIZADO)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <--- 1. IMPORTE O LINK
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

function HomePage() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true); // <-- Adicionado estado de loading
    const [error, setError] = useState(null); // <-- Adicionado estado de erro
    const numeroFornecedor = "5531996809118"; 

    useEffect(() => {
        fetch('http://localhost/backend-php/api/get-produtos.php')
            .then(response => {
                if (!response.ok) { // <-- Adicionada verificação de erro
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setProducts(data);
                setLoading(false); // <-- Desativa o loading
            })
            .catch(error => {
                console.error("Erro ao buscar produtos:", error);
                setError(error.message); // <-- Salva o erro
                setLoading(false);
            });
    }, []);

    // 2. ATUALIZE A FUNÇÃO PARA RECEBER O 'EVENT'
    const handleAddToCart = (event, product) => {
        // Impede que o clique no botão ative o Link pai
        event.stopPropagation();
        event.preventDefault();

        // Sua lógica original
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

        const link = `https://wa.me/${numeroFornecedor}?text=${encodeURIComponent(mensagem)}`;
        window.open(link, '_blank');
    };

    // Função para renderizar o conteúdo principal
    const renderContent = () => {
        if (loading) {
            return <p>Carregando produtos...</p>;
        }
        if (error) {
            return <p>Erro ao carregar produtos: {error}</p>;
        }
        if (products.length === 0) {
            return <p>Nenhum produto encontrado.</p>;
        }

        // 3. SE TUDO DEU CERTO, RENDERIZA A GRADE
        return products.map(product => (
            // 4. ENVOLVA O CARD NO <LINK>
            <Link to={`/produto/${product.id}`} key={product.id} className="product-link-wrapper">
                <ProductCard 
                    product={product} 
                    // 5. PASSE A FUNÇÃO DESTA FORMA
                    onAddToCart={(e) => handleAddToCart(e, product)} 
                />
            </Link>
        ));
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
                    {renderContent()} {/* <-- Chama a função de renderização */}
                </main>
            </div>
        </>
    );
}

export default HomePage;