import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './CategoriesNavBar.css';

export default function CategoriesNavBar() {
    const [categories, setCategories] = useState([]);

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
             <ul>
              <li>
              <Link href="/menu">
                <button className="category-button">
                  Todos
                </button>
              </Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={`/menu?categoria=${category.id}`}>
                  <button className="category-button">
                    {category.nombre}
                  </button>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
    );
    }