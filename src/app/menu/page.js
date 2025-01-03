'use client';
import ProductCard from '@/components/ProductCard/ProductCard';
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

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

  const filteredProducts = products.filter(
    (product) =>
      (categoryFilter === 'all' || product.categoria_id === parseInt(categoryFilter)) &&
      product.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Función para añadir al carrito o actualizar la cantidad
  const addToCart = (product, cantidad) => {
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);

    if (existingProductIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].cantidad += cantidad;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, cantidad }]);
    }

    setTotalPrice((prevTotal) => prevTotal + product.precio * cantidad);
  };

  // Función para eliminar un producto del carrito
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    const productToRemove = cart.find((item) => item.id === productId);

    setTotalPrice((prevTotal) => prevTotal - productToRemove.precio * productToRemove.cantidad);
    setCart(updatedCart);
  };

  // Función para cambiar la cantidad de un producto en el carrito
  const updateQuantity = (productId, nuevaCantidad) => {
    const updatedCart = cart.map((item) => {
      if (item.id === productId) {
        const diferenciaCantidad = nuevaCantidad - item.cantidad;
        setTotalPrice((prevTotal) => prevTotal + item.precio * diferenciaCantidad);
        return { ...item, cantidad: nuevaCantidad };
      }
      return item;
    });
    setCart(updatedCart);
  };

  return (
    <>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold my-6">NUESTRO MENÚ</h1>

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
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
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
              <div className="mt-2">
                <label className="mr-2">Cantidad:</label>
                <input
                  type="number"
                  min="1"
                  defaultValue="1"
                  className="p-1 border rounded w-16"
                  id={`cantidad-${product.id}`}
                />
              </div>
              <button
                onClick={() => {
                  const cantidad = parseInt(
                    document.getElementById(`cantidad-${product.id}`).value
                  );
                  if (cantidad > 0) {
                    addToCart(product, cantidad);
                  }
                }}
                className="bg-orange-500 text-white p-1 rounded mt-2"
              >
                Añadir a Favoritos
              </button>
            </div>
          ))}
        </div>

        {/* Resumen del carrito */}
        <div className="mt-8 border-t pt-4">
          <h2 className="text-2xl font-bold mb-4">FAVORITOS</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Su lista está vacía</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border rounded shadow-md p-4 flex flex-col items-center text-center"
                  >
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-20 h-20 object-cover rounded-full mb-4"
                    />
                    <span className="font-semibold">{item.nombre}</span>
                    <div>
                      <label>Cantidad:</label>
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value))
                        }
                        className="p-1 border rounded w-16 mx-2"
                      />
                    </div>
                    <span>Subtotal: ${(item.precio * item.cantidad).toFixed(2)}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-red-500 text-white p-1 rounded mt-2"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
              <div className="text-lg font-bold mt-4">Total: ${totalPrice.toFixed(2)}</div>
            </>
          )}
        </div>
      </div>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
    </>
  );
}
