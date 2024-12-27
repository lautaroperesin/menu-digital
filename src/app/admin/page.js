'use client';
import { useState, useEffect } from 'react';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', image: '' });

  useEffect(() => {
    fetch('/api/productos')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });
    setNewProduct({ name: '', price: '', image: '' });
  };

  return (
    <div>
       <h1>Panel de Administración</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Precio"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="URL de la imagen"
          value={newProduct.image}
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
        />
        <button type="submit">Agregar</button>
      </form>
      <h2>Productos Cargados en la Base de Datos</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h2>{product.nombre}</h2>
            <p>${product.precio}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}