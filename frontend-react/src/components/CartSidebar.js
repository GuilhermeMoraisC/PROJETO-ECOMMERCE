// Arquivo: src/components/CartSidebar.js
import React from 'react';
import './CartSidebar.css';

// Componente CartSidebar recebe os dados e funções do carrinho
function CartSidebar({ cartItems, isOpen, onClose, onRemove, onUpdateQuantity, onCheckout }) {
    if (!isOpen) return null;
    // CORREÇÃO AQUI: Garante que o preço seja um número ou 0
    const total = cartItems.reduce((acc, item) => {
        const precoItem = parseFloat(item.preco) || 0;
        return acc + precoItem * item.quantity;
    }, 0);


    return (
        <div className="cart-sidebar-backdrop" onClick={onClose}>
            <div 
                className="cart-sidebar" 
                // Impede que o clique no sidebar feche o modal
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="cart-header">
                    <h3>🛒 Seu Carrinho</h3>
                    <button onClick={onClose} className="close-btn">×</button>
                </div>
                
                <div className="cart-items-list">
                    {cartItems.length === 0 ? (
                        <p>Seu carrinho está vazio.</p>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img src={item.imagem_url} alt={item.nome} className="item-thumb" />
                                <div className="item-details">
                                    <h4>{item.nome}</h4>
                                    <p>R$ {item.preco.toFixed(2)}</p>
                                </div>
                                <div className="item-actions">
                                    <div className="quantity-control">
                                        <button 
                                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} 
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                    <button onClick={() => onRemove(item.id)} className="remove-btn">
                                        Remover
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-footer">
                    <div className="cart-total">
                        <span>Total:</span>
                        <strong>R$ {total.toFixed(2)}</strong>
                    </div>
                    {cartItems.length > 0 && (
                        <button className="checkout-btn" onClick={onCheckout}>
                            Finalizar Compra (WhatsApp)
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CartSidebar;