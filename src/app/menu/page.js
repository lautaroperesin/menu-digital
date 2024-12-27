'use client';
import ProductCard from '@/components/ProductCard';
import { useEffect, useState } from 'react';

export default function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('/api/productos')
      .then((res) => res.json())
      .then((data) => setProductos(data));
  }, []);

  return (
    <>
      <h1>"Descubre nuestra selección exclusiva de platillos, bebidas y especialidades, cuidadosamente elaboradas para ofrecerte una experiencia única."</h1>
      <ul>
      {productos.map((producto) => (
        <li key={producto.id}>  
          <ProductCard title={producto.nombre} price={producto.precio} description={producto.descripcion} category={producto.categoria} imageUrl={producto.imagen}/>
        </li>
      ))}
      </ul>
    </>
  );
}





 /*  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('/api/productos')
      .then((res) => res.json())
      .then((data) => setProductos(data));
  }, []);

  return (
    <div>
      <h1>Menú</h1>
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            <img src={producto.imagen} alt={producto.nombre} />
            <h2>{producto.nombre}</h2>
            <p>{producto.descripcion}</p>
            <p>${producto.precio}</p>
          </li>
        ))}
      </ul>
    </div>
  ); */