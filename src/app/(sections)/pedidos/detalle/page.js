'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DetallePedidoPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pedidoExitoso, setPedidoExitoso] = useState(false);
  const [entrega, setEntrega] = useState('retiro');
  const [formaPago, setFormaPago] = useState('efectivo');
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    referencia: ''
  });

  // Cargar carrito desde localStorage
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      setCartItems(JSON.parse(carritoGuardado));
      console.log('Carrito cargado:', JSON.parse(carritoGuardado));
    } else {
      console.log('No hay productos en el carrito');
      router.push('/pedidos');
    }
  }, [router]);

  // Enviar datos del pedido al servidor
  const realizarPedido = async () => {
    const total = cartItems.reduce((total, item) => {
      const itemSubtotal = parseFloat(item.subtotal) || 0;
      return total + itemSubtotal;
    }, 0);

    if (!datosUsuario.nombre || !datosUsuario.telefono) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const pedido = {
      estado: 'pendiente',
      forma_entrega: entrega,
      forma_pago: formaPago,
      nombre_cliente: datosUsuario.nombre,
      telefono_cliente: datosUsuario.telefono,
      direccion_cliente: entrega === 'delivery' ? datosUsuario.direccion : null,
      total: total,
      detalle_pedidos: cartItems.map(item => ({
        producto_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
        subtotal: item.subtotal
      }))
    };

    try {
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
        console.log('Pedido realizado con éxito', data);
        setPedidoExitoso(true);
        setCartItems([]);
        localStorage.removeItem('carrito');
        //router.push('/pedidos');
        setTimeout(() => setPedidoExitoso(false), 3000);
      } else {
        const errorData = await response.json();
        console.error('Error al enviar el pedido:', errorData);
        alert('Hubo un error al procesar tu pedido. Inténtalo nuevamente.');
      }
    } catch (error) {
      console.error('Error al realizar el pedido:', error);
    }
  };
  
  // Calcular el total del pedido
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemSubtotal = parseFloat(item.subtotal);
      return total + itemSubtotal;
    }, 0);
  };

    // Confimacion del pedido
    const handleConfirmOrder = () => {
      realizarPedido();
      setShowConfirmDialog(false);
    };
  
  // Evitar scroll del body cuando el modal está abierto
  useEffect(() => {
    if (showConfirmDialog) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showConfirmDialog]);
  
  // Componente de diálogo de confirmación
  const ConfirmDialog = () => showConfirmDialog && (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay con efecto de desenfoque */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
           onClick={() => setShowConfirmDialog(false)}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg max-w-md w-full shadow-xl transform transition-all"
             onClick={(e) => e.stopPropagation()}
        >
          
          {/* Header */}
          <div className="border-b p-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Confirmar Pedido
              </h3>
              <button onClick={() => setShowConfirmDialog(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500">
                ✕
              </button>
          </div>
          
          {/* Contenido */}
          <div className="p-4 space-y-4">
            <p className="text-sm text-gray-600">
              ¿Estás seguro de que deseas realizar este pedido?
              </p>
          </div>
            
            
            {/* Footer */}
            <div className="border-t p-4 flex justify-end space-x-2">
              <button
              onClick={() => setShowConfirmDialog(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Cancelar
              </button>

              <button
              onClick={handleConfirmOrder}
              className="px-4 py-2 text-sm font-medium text-black bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Confirmar Pedido
              </button>
            </div>
          </div>
        </div>
      </div>
      );
      
  return (
      <>
      <ConfirmDialog />

      {pedidoExitoso && (
        <div className="fixed top-16 left-0 right-0 z-50 flex justify-center p-4 bg-green-500 text-white">
          Pedido realizado con éxito, ¡gracias por tu compra!
        </div>
      )}
      
      <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto bg-gray-200 rounded-lg shadow-lg">
        {/* Lista de productos */}
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-2 border border-gray-300 rounded-lg hover:border-[#ff9800] transition-colors"
            >
              <div>
                <h3 className="font-medium text-[#333]">{item.nombre}</h3>
                <p className="text-sm text-gray-600">
                  ${item.precio} x {item.cantidad} ={" "}
                  <span>
                    ${item.subtotal}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="w-full flex justify-between items-center p-4 bg-[#333] text-white rounded-lg">
          <span className="font-bold">TOTAL:</span>
          <span className="text-xl font-bold text-[#ff9800]">${calculateTotal()}</span>
        </div>

        {/* Formulario */}
        <form className="space-y-6 border-t border-gray-500 pt-4">
          {/* Forma de entrega */}
          <div className="space-y-3">
            <h3 className="text-[#333] font-bold text-lg">FORMA DE ENTREGA:</h3>
            <div className="flex gap-6 accent-[#ff9800] p-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="entrega"
                  value="retiro"
                  checked={entrega === 'retiro'}
                  onChange={() => setEntrega('retiro')}
                  className="text-[#ff9800] focus:ring-[#ff9800]"
                />
                <span className="text-[#333]">Retiro en el local</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="entrega"
                  value="delivery"
                  checked={entrega === 'delivery'}
                  onChange={() => setEntrega('delivery')}
                  className="text-[#ff9800] focus:ring-[#ff9800]"
                />
                <span className="text-[#333]">Delivery</span>
              </label>
            </div>
          </div>

          {/* Dirección (condicional) */}
          {entrega === 'delivery' && (
            <div className="space-y-2">
              <label className="block">
                <h3 className="text-[#333] font-bold text-lg">DIRECCIÓN:</h3>
                <input
                  type="text"
                  value={datosUsuario.direccion}
                  onChange={(e) =>
                    setDatosUsuario({ ...datosUsuario, direccion: e.target.value })
                  }
                  className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff9800] focus:ring focus:ring-[#ff9800] focus:ring-opacity-50"
                />
              </label>
            </div>
          )}

          {/* Forma de pago */}
          <div className="space-y-2">
            <h3 className="text-[#333] font-bold text-lg">FORMA DE PAGO:</h3>
            <select
              value={formaPago}
              onChange={(e) => setFormaPago(e.target.value)}
              className="block w-full rounded-md border-gray-300 p-4 shadow-sm focus:border-[#ff9800] focus:ring focus:ring-[#ff9800] focus:ring-opacity-50"
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta de Crédito/Débito</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>

          {/* Datos del usuario */}
          <div className="space-y-4">
            <h3 className="text-[#333] font-bold text-lg">TUS DATOS:</h3>
            <div className="grid grid-cols-1 gap-4">
              <label className="block">
                <span className="text-[#333] font-medium">Nombre:</span>
                <input
                  type="text"
                  value={datosUsuario.nombre}
                  onChange={(e) =>
                    setDatosUsuario({ ...datosUsuario, nombre: e.target.value })
                  }
                  className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff9800] focus:ring focus:ring-[#ff9800] focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-[#333] font-medium">Teléfono:</span>
                <input
                  type="text"
                  value={datosUsuario.telefono}
                  onChange={(e) =>
                    setDatosUsuario({ ...datosUsuario, telefono: e.target.value })
                  }
                  className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff9800] focus:ring focus:ring-[#ff9800] focus:ring-opacity-50"
                />
              </label>
            </div>
          </div>
        </form>

        {/* Botón de finalizar */}
        <button
          className="w-full bg-[#ff9800] text-[#333] font-bold py-3 rounded-lg 
                    disabled:opacity-50 disabled:cursor-not-allowed
                    hover:bg-[#ff9800]/90 transition-colors
                    focus:outline-none focus:ring-2 focus:ring-[#ff9800] focus:ring-opacity-50"
          onClick={() => setShowConfirmDialog(true)}
          disabled={!formaPago || !datosUsuario.nombre || !datosUsuario.telefono || (entrega === 'delivery' && !datosUsuario.direccion)}
        >
          FINALIZAR PEDIDO
        </button>
      </div>
      </>
  );
}