'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard/ProductCard";
import OrderCart from "@/components/OrderCart/OrderCart";
import CategoriesNavBar from "@/components/CategoriesNavBar/CategoriesNavBar";

export default function CategoriaPage() {
  const paramsPromise = useParams();
  const categoriaId = paramsPromise.categoriaId;
  const router = useRouter();
  const { mesa } = router.query;

  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(null);

  if (mesa) {
    // El usuario escaneó un QR y está en el restaurante
    console.log(`El usuario está en la mesa: ${table}`);
  } else {
    // El usuario ingresó por otro medio (no está en el restaurante)
    console.log('El usuario no está en el restaurante');
  }

  // Obtener los productos por categoria
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch(`/api/productos?categoria=${categoriaId}`);
        const data = await res.json();
        setProductos(data);
      }
      catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    fetchProductos();
  }
  , []);

  // Desplazar hacia la csubcategoria seleccionada
  useEffect(() => {
    if (subcategoriaSeleccionada) {
      const element = document.getElementById(subcategoriaSeleccionada);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [subcategoriaSeleccionada]);

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
    <div className="p-6">
      <CategoriesNavBar categoriaId={categoriaId} onSelectSubcategoria={setSubcategoriaSeleccionada} />

      {productos && Object.entries(
        productos.reduce((grupos, producto) => {
          // Determinar la subcategoría (usando subcategoria_id o un valor predeterminado)
          const subcategoria = producto.subcategoria_nombre || 'OTROS';

          // Inicializar el array para la subcategoría si no existe
          if (!grupos[subcategoria]) {
            grupos[subcategoria] = [];
          }

          // Agregar el producto al grupo correspondiente
          grupos[subcategoria].push(producto);

          return grupos;
        }, {})
      ).map(([subcategoria, productos]) => (
        <div key={subcategoria} id={subcategoria}>
          <h2 className="text-xl font-bold text-black mt-4 p-4 bg-[#ff9500f6] rounded-md">{subcategoria}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productos.map((producto) => (
              <ProductCard key={producto.id} producto={producto} onAddToCart={agregarAlCarrito}/>
            ))}
          </div>
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