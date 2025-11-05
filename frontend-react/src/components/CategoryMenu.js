// Arquivo: src/components/CategoryMenu.js (NOVO)
import React, { useState, useEffect } from 'react';
import './CategoryMenu.css';

// Recebe a categoria selecionada (ID) e a função para mudar
function CategoryMenu({ selectedCategory, onSelectCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Busca as categorias da API que já criamos para o Admin
    // (Esta API é pública e não precisa de login)
    fetch('http://localhost/backend-php/api/admin/get-categorias.php')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch(error => console.error("Erro ao buscar categorias:", error));
  }, []);

  return (
    <nav className="category-menu">
      <div className="container category-content">
        {/* Botão "Todos" */}
        <button
          // O botão "Todos" é ativo se selectedCategory for null
          className={`category-button ${!selectedCategory ? 'active' : ''}`}
          onClick={() => onSelectCategory(null)}
        >
          Todos
        </button>
        
        {/* Mapeia as categorias vindas do banco */}
        {categories.map(category => (
          <button
            key={category.id}
            // O botão é ativo se o ID da categoria for o selecionado
            className={`category-button ${selectedCategory == category.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.nome}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default CategoryMenu;