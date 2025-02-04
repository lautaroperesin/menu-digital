'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function DetallePedidoPage() {
  const router = useRouter();
  const { pedidoId } = router.query;

  const realizarPedido = async () => {
    const total = carrito.reduce((total, item) => {
      const itemSubtotal = parseFloat(item.subtotal) || 0;
      return total + itemSubtotal;
    }, 0);

    try {
      const pedido = {
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
        setPedidoExitoso(true);
        setCarrito([]);
        setTimeout(() => setPedidoExitoso(false), 3000);
      }
    } catch (error) {
      console.error('Error al realizar el pedido:', error);
    }
  };

       const [showConfirmDialog, setShowConfirmDialog] = useState(false);

/*         const calculateTotal = () => {
            return cartItems.reduce((total, item) => {
                const itemSubtotal = parseFloat(item.subtotal);
                return total + itemSubtotal;
            }, 0);
        }; */

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

                  const handleConfirmOrder = () => {
                    realizarPedido();
                    setShowConfirmDialog(false);
                  };

              const ConfirmDialog = () => showConfirmDialog && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                  {/* Overlay con efecto de desenfoque */}
                  <div 
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
                    onClick={() => setShowConfirmDialog(false)}
                  />
                  
                  {/* Modal */}
                  <div className="flex min-h-full items-center justify-center p-4">
                    <div 
                      className="relative bg-white rounded-lg max-w-md w-full shadow-xl transform transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Header */}
                      <div className="border-b p-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Confirmar Pedido
                        </h3>
                        <button
                          onClick={() => setShowConfirmDialog(false)}
                          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                        >
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
        <div className="flex flex-col gap-4 mt-4">
          <h1 className="text-2xl font-semibold text-gray-900">Detalle del Pedido {pedidoId}</h1>
                            <div className="w-full flex justify-between items-center">
                              <span className="font-bold">Total:</span>
                              {/* <span className="text-xl font-bold">${calculateTotal()}</span> */}
                            </div>
                            <button
                              className="w-full bg-yellow-500 text-black font-semibold py-2 rounded disabled:opacity-50 hover:bg-yellow-600"
                              onClick={ConfirmDialog}
                            >
                              Finalizar Pedido
                            </button>
                            </div>
    );
}