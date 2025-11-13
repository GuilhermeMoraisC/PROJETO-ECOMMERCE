// Arquivo: src/components/CartSidebar.js
import React from 'react';
import './CartSidebar.css';

// Recebe todas as novas props de frete
function CartSidebar({ 
    cartItems, isOpen, onClose, onRemove, onUpdateQuantity, onCheckout,
    cep, setCep, shippingOptions, selectedShipping, setSelectedShipping, 
    onCalculateShipping, shippingLoading, shippingError
}) {
    if (!isOpen) return null;

    // Renomeado para 'subtotal'
    const subtotal = cartItems.reduce((acc, item) => {
        // CORREÇÃO AQUI: Garante que o preço seja um número ou 0
        const precoItem = parseFloat(item.preco) || 0;
        return acc + precoItem * item.quantity;
    }, 0);

    // Calcula o total geral (subtotal + frete)
    // Garante que selectedShipping.valor é um número
    const freteValor = (selectedShipping && parseFloat(selectedShipping.valor)) || 0;
    const totalGeral = subtotal + freteValor;

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
                                    {/* Garante que o preço seja formatado corretamente */}
                                    <p>R$ {(parseFloat(item.preco) || 0).toFixed(2)}</p>
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

                {/* --- SEÇÃO DE FRETE (ADICIONADA) --- */}
                {cartItems.length > 0 && (
                    <div className="cart-shipping-section">
                        <h4>Calcular Frete</h4>
                        <div className="cep-input-group">
                            <input 
                                type="tel" // 'tel' abre o teclado numérico em celulares
                                placeholder="Digite seu CEP" 
                                value={cep}
                                onChange={(e) => setCep(e.target.value)}
                                className="cep-input"
                                maxLength={9} // Ex: 12345-678
                            />
                            <button 
                                onClick={onCalculateShipping} 
                                disabled={shippingLoading}
                                className="cep-button"
                            >
                                {shippingLoading ? '...' : 'Calcular'}
                            </button>
                        </div>
                        
                        {/* Exibe erro ou opções */}
                        {shippingError && <p className="shipping-error">{shippingError}</p>}
                        
                        {shippingOptions.length > 0 && (
                            <div className="shipping-options">
                                {shippingOptions.map(option => (
                                    <label key={option.codigo} className="shipping-option">
                                        <input 
                                            type="radio" 
                                            name="shipping" 
                                            // Verifica se o 'codigo' da opção é o mesmo do 'selectedShipping'
                                            checked={selectedShipping?.codigo === option.codigo}
                                            onChange={() => setSelectedShipping(option)}
                                        />
                                        {option.tipo} - R$ {option.valor.toFixed(2)} 
                                        <span>(Prazo: {option.prazo} dias)</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {/* --- FIM DA SEÇÃO DE FRETE --- */}


                <div className="cart-footer">
                    {/* Exibe Subtotal e Frete separado */}
                    <div className="cart-total-details">
                        <div className="cart-total-line">
                            <span>Subtotal:</span>
                            <strong>R$ {subtotal.toFixed(2)}</strong>
                        </div>
                        {selectedShipping && (
                            <div className="cart-total-line">
                                <span>Frete ({selectedShipping.tipo}):</span>
                                <strong>R$ {selectedShipping.valor.toFixed(2)}</strong>
                            </div>
                        )}
                    </div>
                    
                    {/* O Total agora é o totalGeral */}
                    <div className="cart-total">
                        <span>Total:</span>
                        <strong>R$ {totalGeral.toFixed(2)}</strong>
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