'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMesaInfo } from '../context/MesaContext';
import styles from './Menu.module.css'; 

export default function Menu() {
  const [categorias, setCategorias] = useState([]);
  const searchParams = useSearchParams();
  const { mesaId, actualizarMesaId } = useMesaInfo();

  useEffect(() => {
    // Actualiza el contexto con el parámetro de la URL si está disponible
    const mesaParam = searchParams.get('mesa');
    
    if (mesaParam) {
      actualizarMesaId(mesaParam);
    }
  }, [searchParams, actualizarMesaId]);

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
    <div>
    {mesaId ? (
      <div className="bg-green-100 p-3 rounded mb-4">
        Estás ordenando desde la Mesa #{mesaId}
      </div>
    ) : (
      <div className="bg-yellow-100 p-3 rounded mb-4">
        Estás ordenando para entrega
      </div>
    )}
    <div className={styles.home}>
      <div className={styles.presentation}>
        {categorias.map((categoria) => (
          <Link href={`/menu/${categoria.id}`} key={categoria.id}>
            <button className={styles.button}>{categoria.nombre}</button>
          </Link>
        ))}
      </div>
    </div>
    </div>
  );
}