// Arquivo: src/components/ProductCard.js (ATUALIZADO)
import React from 'react';
import './ProductCard.css';

function ProductCard({ product, onAddToCart }) {
    return (
        <div className="card">
            <img src={product.imagem_url} alt={product.nome} className="card-image" />
            <div className="card-body">
                <h3 className="card-title">{product.nome}</h3>
                <p className="card-price">R$ {parseFloat(product.preco).toFixed(2)}</p>
                {/* <p className="card-description">{product.descricao}</p> */}
                <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    );
}

export default ProductCard;
