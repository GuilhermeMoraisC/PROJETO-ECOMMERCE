// Arquivo: src/components/ProductCard.js (CORRIGIDO)
import React from 'react';
import './ProductCard.css';

function ProductCard({ product, onAddToCart }) {
    return (
        <div className="card">
            <img src={product.imagem_url} alt={product.nome} className="card-image" />
            <div className="card-body">
                <h3 className="card-title">{product.nome}</h3>
                <p className="card-price">A partir de R$ {parseFloat(product.preco).toFixed(2)}</p>
                
                {/* CORREÇÃO AQUI: 
                  Mude de: onClick={() => onAddToCart(product)}
                  Para:   onClick={(e) => onAddToCart(e, product)}
                */}
                {/* <button className="add-to-cart-btn" onClick={(e) => onAddToCart(e, product)}>
                    Adicionar ao Carrinho
                </button> */}
            </div>
        </div>
    );
}

export default ProductCard;