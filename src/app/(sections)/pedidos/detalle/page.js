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
        router.push('/pedidos');
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
      
      <div className="flex flex-col gap-4 mt-4 p-20">
        <div>
          {cartItems.map((item) => (
            <div
            key={item.id}
            className="flex items-center justify-between gap-3 p-3 bg-white rounded-md shadow hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="font-medium text-gray-900">{item.nombre}</h3>
                <p className="text-sm text-gray-600">
                  ${item.precio} x {item.cantidad} ={" "}
                  <span className="font-semibold text-gray-800">
                    ${item.subtotal}
                  </span>
                </p>
              </div>
            </div>
            ))}
        </div>
        
        <div className="w-full flex justify-between items-center">
          <span className="font-bold">TOTAL:</span>
          <span className="text-xl font-bold">${calculateTotal()}</span>
        </div>

         <form>
        {/* Forma de entrega */}
        <div>
          <h3>FORMA DE ENTREGA:</h3>
          <label>
            <input
              type="radio"
              name="entrega"
              value="retiro"
              checked={entrega === 'retiro'}
              onChange={() => setEntrega('retiro')}
            />
            Retiro en el local
          </label>
          <label>
            <input
              type="radio"
              name="entrega"
              value="delivery"
              checked={entrega === 'delivery'}
              onChange={() => setEntrega('delivery')}
            />
            Delivery
          </label>
        </div>

        {/* Dirección (solo visible si selecciona "delivery") */}
        {entrega === 'delivery' && (
          <div>
            <label>
              DIRECCIÓN:
              <input
                type="text"
                value={datosUsuario.direccion}
                onChange={(e) =>
                  setDatosUsuario({ ...datosUsuario, direccion: e.target.value })
                }
              />
            </label>
          </div>
        )}

        {/* Forma de pago */}
        <div>
          <h3>FORMA DE PAGO:</h3>
          <select
            value={formaPago}
            onChange={(e) => setFormaPago(e.target.value)}
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta de Crédito/Débito</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>

        {/* Datos del usuario */}
        <div>
          <h3>TUS DATOS:</h3>
          <label>
            Nombre:
            <input
              type="text"
              value={datosUsuario.nombre}
              onChange={(e) =>
                setDatosUsuario({ ...datosUsuario, nombre: e.target.value })
              }
            />
          </label>
          <label>
            Teléfono:
            <input
              type="text"
              value={datosUsuario.telefono}
              onChange={(e) =>
                setDatosUsuario({ ...datosUsuario, telefono: e.target.value })
              }
            />
          </label>
        </div>
      </form>


          <button
            className="w-full bg-yellow-500 text-black font-semibold py-2 rounded disabled:opacity-50 hover:bg-yellow-600"
            onClick={() => setShowConfirmDialog(true)}
            disabled={!formaPago || !datosUsuario.nombre || !datosUsuario.telefono || (entrega === 'delivery' && !datosUsuario.direccion)}>
              FINALIZAR PEDIDO
          </button>
        </div>
      </>
  );
}