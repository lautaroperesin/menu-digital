import React, { useState, useEffect } from 'react';
import { HiMenuAlt3 } from "react-icons/hi";
import './CategoriesNavBar.css';

export default function CategoriesNavBar({ categoriaId, onSelectSubcategoria }) {
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

    const handleSubcategoriaClick = (subcategoria) => {
        onSelectSubcategoria(subcategoria);
        setMenuOpen(false);
      };

    return (
        <nav className="categories-nav-bar">
            {/* Botón de menú hamburguesa */}
            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                <HiMenuAlt3 size={24} />
            </button>

            {/* Menú desplegable */}
            <ul className={`menu-list ${menuOpen ? 'open' : ''}`}>
            <li>
            <button className="category-button" onClick={() => handleSubcategoriaClick(null)}>
                Todas
            </button>
            </li>
            {subcategories.map((category) => (
                <li key={category.id}>
                    <button
                    className="category-button"
                    onClick={() => handleSubcategoriaClick(category.nombre)}
                    >
                    {category.nombre}
                    </button>
                </li>
                ))}
            </ul>

            <h3 className="category-title">Categorías</h3>
        </nav>
    );
}
