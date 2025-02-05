'use client';
import { useEffect, useState } from 'react';
import OrderCart from '@/components/OrderCart/OrderCart';
import ProductCard from '@/components/ProductCard/ProductCard';

export default function PedidosPage() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch('/api/productos');
        const data = await res.json();
        setProductos(data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };
    
    fetchProductos();
  }, []);

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

  return (
    <div className='p-6'>
        {productos.map(producto => (
          <div key={producto.id}>
            <ProductCard producto={producto} onAddToCart={agregarAlCarrito} />
          </div>
        ))}
      <div className="lg:col-span-1">
        <OrderCart
          cartItems={carrito}
          onIncreaseQuantity={aumentarCantidad}
          onDecreaseQuantity={disminuirCantidad}
          onRemoveItem={eliminarDelCarrito}
        />
      </div>
    </div>
  );
}