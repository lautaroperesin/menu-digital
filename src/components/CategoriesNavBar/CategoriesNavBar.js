import React, { useState, useEffect } from 'react';
import './CategoriesNavBar.css';

export default function CategoriesNavBar( {categoriaId} ) {
    const [subcategories, setSubcategories] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                const res = await fetch(`/api/subcategorias/${categoriaId}`);
                const data = await res.json();
                setSubcategories(data);
            } catch (error) {
                console.error('Error al cargar categorías:', error);
            }
        };

        fetchSubcategories();
    }, [categoriaId]);

    return (
        <nav className="categories-nav-bar">
            {/* Botón de menú hamburguesa */}
            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6h16M4 12h16m-7 6h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            {/* Menú desplegable */}
            <ul className={`menu-list ${menuOpen ? 'open' : ''}`}>
                {subcategories.map((category) => (
                    <li key={category.id}>
                        <button className="category-button">{category.nombre}</button>
                    </li>
                ))}
            </ul>

            <h3 className="category-title">Categorías</h3>
        </nav>
    );
}
