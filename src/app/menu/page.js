'use client';
import ProductCard from '@/components/ProductCard';
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch('/api/productos');
    const data = await response.json();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const response = await fetch('/api/categorias');
    const data = await response.json();
    setCategories(data);
  };

  const leakedProducts = products.filter(product => 
    categoryFilter === 'all' || product.categoria_id === parseInt(categoryFilter)
  )

  return (
    <>
      <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-6">Nuestro Menú</h1>

        {/* Filtro de categorías */}
        <div className="mb-6">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {leakedProducts.map((product) => (
       <div key={product.id} className="border rounded-lg p-4 shadow">
          <ProductCard title={product.nombre} price={product.precio} description={product.descripcion} category={product.categoria} imageUrl={product.imagen}/>
        </div>
      ))}
      </div>
    </div>
    </>
  );
}