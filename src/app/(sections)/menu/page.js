'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Menu.module.css'; 

export default function Menu() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('/api/categorias');
        if (!response.ok) {
          throw new Error('Error al cargar las categorías');
        }
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategorias();
  }, []);

  return (
    <div className={styles.home}>
      <div className={styles.presentation}>
        {categorias.map((categoria) => (
          <Link href={`/menu/${categoria.id}`} key={categoria.id}>
            <button className={styles.button}>{categoria.nombre}</button>
          </Link>
        ))}
      </div>
    </div>
  );
}