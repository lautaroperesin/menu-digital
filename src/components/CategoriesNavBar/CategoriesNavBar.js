import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './CategoriesNavBar.css';

export default function CategoriesNavBar() {
    const [categories, setCategories] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categorias');
                const data = await res.json();
                setCategories(data);
            } catch (error) {
                console.error('Error al cargar categorías:', error);
            }
        };

        fetchCategories();
    }, []);

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
                <li>
                    <Link href="/menu">
                        <button className="category-button">Todos</button>
                    </Link>
                </li>
                {categories.map((category) => (
                    <li key={category.id}>
                        <Link href={`/menu?categoria=${category.id}`}>
                            <button className="category-button">{category.nombre}</button>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
