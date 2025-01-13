'use client';
import OrderCart from '@/components/OrderCart';
import ProductCard from '@/components/ProductCard/ProductCard';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Menu() {
  const searchParams = useSearchParams();
  const categoria = searchParams.get('categoria');

  const [products, setProducts] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [mesaId, setMesaId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [pedidoExitoso, setPedidoExitoso] = useState(false);

   useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/productos');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categorias');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };

    const fetchMesas = async () => {
      try {
        const res = await fetch('/api/mesas');
        const data = await res.json();
        setMesas(data);
      } catch (error) {
        console.error('Error al cargar mesas:', error);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchProducts(), fetchCategories(), fetchMesas()]);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (categoria) {
      const filtrados = products.filter(
        (producto) => producto.categoria_id === parseInt(categoria)
      );
      setProductosFiltrados(filtrados);
    } else {
      setProductosFiltrados(products);
    }
  }, [categoria, products]);

  const agregarAlCarrito = (producto) => {
    const itemExistente = carrito.find(item => item.id === producto.id);

    if (itemExistente) {
      setCarrito(carrito.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * item.precio }
          : item
      ));
    } else {
      setCarrito([...carrito, {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        subtotal: producto.precio
      }]);
    }
  };

  const aumentarCantidad = (producto) => {
    setCarrito(carrito.map(item =>
      item.id === producto.id
        ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * item.precio }
        : item
    ));
  };

  const disminuirCantidad = (productoId) => {
    setCarrito(carrito.map(item =>
      item.id === productoId && item.cantidad > 1
        ? { ...item, cantidad: item.cantidad - 1, subtotal: (item.cantidad - 1) * item.precio }
        : item
    ).filter(item => item.cantidad > 0));
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito(carrito.filter(item => item.id !== productoId));
  };

  const onClickMesa = (mesaId) => {
    setMesaId(mesaId);
  }

  const realizarPedido = async () => {
    const total = carrito.reduce((total, item) => {
      const itemSubtotal = parseFloat(item.subtotal) || 0;
      return total + itemSubtotal;
    }, 0);

    try {
      const pedido = {
        mesa_id: mesaId,
        estado: 'pendiente',
        total: total,
        detalle_pedidos: carrito.map(item => ({
          producto_id: item.id,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          subtotal: item.subtotal
        }))
      };

      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error en la respuesta del servidor:', data);
      }

      if (response.ok) {
        console.log('Pedido realizado con éxito');
        alert('Pedido realizado con éxito');
        setPedidoExitoso(true);
        setCarrito([]);
        setTimeout(() => setPedidoExitoso(false), 3000);
      }
    } catch (error) {
      console.error('Error al realizar el pedido:', error);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold my-6">NUESTRO MENÚ</h1>

        {/* Filtro de categorías */}
          <nav className="mb-4 flex justify-center space-x-4 overflow-x rounded-3xl">
             <ul>
              <li>
              <Link href="/menu">
                <button
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                >
                  Todos
                </button>
              </Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={`/menu?categoria=${category.id}`}>
                  <button
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                  >
                    {category.nombre}
                  </button>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

        {/* Productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productosFiltrados.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} onAddToCart={agregarAlCarrito} />
            </div>
          ))}
        </div>

        {/* Carrito de compras */}
        <div className="lg:col-span-1">
          <OrderCart
            cartItems={carrito}
            mesas={mesas}
            onClickMesa={onClickMesa}
            onIncreaseQuantity={aumentarCantidad}
            onDecreaseQuantity={disminuirCantidad}
            onRemoveItem={eliminarDelCarrito}
            onSubmitOrder={realizarPedido}
            orderSuccess={pedidoExitoso}
          />
        </div>
      </div>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
    </>
  );
}
