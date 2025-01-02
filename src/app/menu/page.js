'use client';
import ProductCard from '@/components/ProductCard/ProductCard';
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState(''); // Nuevo estado para búsqueda

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

  const filteredProducts = products.filter(product => 
    (categoryFilter === 'all' || product.categoria_id === parseInt(categoryFilter)) &&
    (product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
     product.descripcion.toLowerCase().includes(searchQuery.toLowerCase())) // Filtrado por búsqueda
  );

  return (
    <>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold my-6">Nuestro Menú</h1>

        {/* Barra de búsqueda */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

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
          {filteredProducts.map((product) => (
            <div key={product.id}>
              <ProductCard
                title={product.nombre}
                price={product.precio}
                description={product.descripcion}
                category={product.categoria}
                imageUrl={product.imagen}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
