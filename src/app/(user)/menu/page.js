'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Menu() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      const response = await fetch('/api/categorias');
      const data = await response.json();
      setCategorias(data);
    };
    fetchCategorias();
  }, []);

  return (
    <>
      <div className='home'>
        <div className='presentation'>
        {categorias.map((categoria) => (
        <Link href={`/menu/${categoria.id}`} key={categoria.id}>
          <button>
          {categoria.nombre}
          </button>
        </Link>
        ))}
        </div>

      </div>
    </>
  );
}
