'use client';
import { useState, useEffect } from 'react';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '', 
    image: '',
    category: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch('/api/productos');
    const data = await response.json();
    setProducts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

      const response = await fetch('/api/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    });

    if (response.ok) {
      setNewProduct({
        name: '',
        description: '',
        price: ''  ,
        image: '',
        category: ''
      });
      fetchProducts();
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-6">Panel de Administración</h1>

      {/* Formulario de nuevo producto */}
      <form onSubmit={handleSubmit} className="max-w-lg mb-8">
        <div className="mb-4">
          <label className="block mb-2">Nombre:</label>
          <input
            type="text"
            value={newProduct.name}
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {/* Agregar campos similares para descripción, precio, categoría e imagen */}
        <div className="mb-4">
          <label className="block mb-2">Descripción:</label>
          <input
            type="text"
            value={newProduct.description}
            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Precio:</label>
          <input
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Categoría:</label>
          <input
            type="text"
            value={newProduct.category}
            onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Imagen:</label>
          <input
            type="text"
            value={newProduct.image}
            onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Agregar Producto
        </button>
      </form>

      {/* Lista de productos existentes */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Precio</th>
              <th className="border p-2">Categoría</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td className="border p-2">{product.nombre}</td>
                <td className="border p-2">${product.precio}</td>
                <td className="border p-2">{product.categoria}</td>
                <td className="border p-2">
                  <button className="text-blue-500 mr-2">Editar</button>
                  <button className="text-red-500">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}