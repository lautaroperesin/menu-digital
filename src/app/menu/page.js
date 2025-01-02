'use client';
import ProductCard from '@/components/ProductCard/ProductCard';
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState(''); 
  const [cart, setCart] = useState([]); // Estado del carrito

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

  // Función para agregar mis productos favoritos
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

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

        {/* Productos */}
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
              {/* Botón para agregar al carrito */}
              <button
                onClick={() => addToCart(product)}
                className="bg-blue-500 text-white p-0.5 rounded mt-0"
              >
                Añadir a favoritos
              </button>
            </div>
          ))}
        </div>

        {/* Resumen del carrito */}
        <div className="mt-8 border-t pt-4">
          <h2 className="text-2xl font-bold mb-4">Favoritos</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Su lista está vacía</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border rounded shadow-md p-4 flex flex-col items-center text-center"
                >
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-20 h-20 object-cover rounded-full mb-4"
                  />
                  <span className="font-semibold">{item.nombre}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
}
