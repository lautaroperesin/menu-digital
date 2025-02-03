import React, { useState, useEffect } from "react";
import { RiArrowDownDoubleFill, RiArrowUpDoubleFill  } from "react-icons/ri";

export default function OrderCart({ cartItems,
    //mesas,
    //onClickMesa,
    onIncreaseQuantity, 
    onDecreaseQuantity, 
    onRemoveItem, 
    onSubmitOrder,
    orderSuccess }) {
        //const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
        const [isSticky, setIsSticky] = useState(false);
        const [isExpanded, setIsExpanded] = useState(true);
        const [showConfirmDialog, setShowConfirmDialog] = useState(false);

        useEffect(() => {
            setIsSticky(cartItems.length > 0);
          }, [cartItems]);

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

        const calculateTotal = () => {
            return cartItems.reduce((total, item) => {
                const itemSubtotal = parseFloat(item.subtotal);
                return total + itemSubtotal;
            }, 0);
        };

       /*  const handleClick = (id) => {
            setMesaSeleccionada(id);
            onClickMesa(id);
          }; */

          const handleClickRealizarPedido = () => {
            setIsExpanded(false);
            setShowConfirmDialog(true);
          };

          const handleConfirmOrder = () => {
            setShowConfirmDialog(false);
            onSubmitOrder();
          };

   /*        const getMesaSeleccionada = () => {
            return mesas.find(mesa => mesa.id === mesaSeleccionada)?.nombre_mesa || '';
          }; */

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
                    <div className="bg-gray-50 p-4 rounded-lg">
      {/*                 <p className="font-medium text-gray-700 mb-2">
                        {getMesaSeleccionada()}
                      </p> */}
                      <div className="space-y-2">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.cantidad}x {item.nombre}</span>
                            <span className="font-medium">${item.subtotal}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Total:</span>
                            <span>${calculateTotal()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
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

          const MinimizedCart = () => (
            <div className="flex items-center justify-between px-4 py-2 bg-white border-t shadow-lg">
              <span className="font-semibold">{cartItems.length} items</span>
              <button 
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-2 bg-yellow-50 hover:bg-yellow-100 p-2 rounded-full transition-all duration-300"
              >
              <RiArrowUpDoubleFill size={30}/>
              </button>
              <div className="flex items-center gap-4">
                <span className="font-bold">${calculateTotal()}</span>
              </div>
            </div>
          );
        
          return (
            <>
              <ConfirmDialog />

              {orderSuccess && (
                <div className="fixed top-16 left-0 right-0 z-50 flex justify-center p-4 bg-green-500 text-white">
                  Su pedido estará listo en unos minutos. ¡Gracias por su preferencia!
                </div>
              )}
        
              {isSticky && (
                <div className={`fixed bottom-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
                  isExpanded ? 'h-auto max-h-[80vh]' : 'h-auto'
                }`}>
                  {isExpanded ? (
                    <div className="bg-white border-t shadow-lg">
                      <div className="container mx-auto">
                        <button 
                          onClick={() => setIsExpanded(false)}
                          className="w-full flex items-center justify-center p-2 bg-yellow-50 hover:bg-yellow-100 transition-all duration-300"
                        >
                        <RiArrowDownDoubleFill size={30}/>
                        </button>
                        
                        <div className="p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
                          {/* Pedido actual */}
                          <div className="col-span-1">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                              Pedido Actual
                            </h2>
                            <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                              {cartItems.length === 0 ? (
                                <p className="text-gray-500 text-center italic">No hay productos seleccionados</p>
                              ) : (
                                <div className="space-y-3">
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
                                      <div className="flex items-center gap-2">
                                        <button
                                          className="w-8 h-8 flex items-center justify-center text-red-600 border border-red-600 rounded-full hover:bg-red-600 hover:text-white transition-colors"
                                          onClick={() => onDecreaseQuantity(item.id)}
                                        >
                                          -
                                        </button>
                                        <p className="text-sm font-medium text-gray-800">
                                          {item.cantidad}
                                        </p>
                                        <button
                                          className="w-8 h-8 flex items-center justify-center text-green-600 border border-green-600 rounded-full hover:bg-green-600 hover:text-white transition-colors"
                                          onClick={() => onIncreaseQuantity(item)}
                                        >
                                          +
                                        </button>
                                        <button
                                          className="w-8 h-8 flex items-center justify-center text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                                          onClick={() => onRemoveItem(item.id)}
                                        >
                                          ✖
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
        
                          {/* Mesas */}
                         {/*  <div className="mesas flex flex-wrap justify-center gap-3 p-4 bg-gray-100 rounded-md shadow-md mt-4">
                            {mesas.map((mesa) => (
                              <button
                                key={mesa.id}
                                className={`px-4 py-2 text-sm font-bold rounded-md transition-colors duration-300 ${
                                  mesaSeleccionada === mesa.id
                                    ? "bg-yellow-500 text-white"
                                    : "bg-yellow-100 text-gray-700 hover:bg-yellow-500 hover:text-white"
                                }`}
                                onClick={() => handleClick(mesa.id)}
                              >
                                {mesa.nombre_mesa}
                              </button>
                            ))}
                          </div> */}
        
                          {/* Total y botón de enviar */}
                          <div className="flex flex-col gap-4 mt-4">
                            <div className="w-full flex justify-between items-center">
                              <span className="font-bold">Total:</span>
                              <span className="text-xl font-bold">${calculateTotal()}</span>
                            </div>
                            <button
                              className="w-full bg-yellow-500 text-black font-semibold py-2 rounded disabled:opacity-50 hover:bg-yellow-600"
                              disabled={cartItems.length === 0 /* || mesaSeleccionada === null */}
                              onClick={handleClickRealizarPedido}
                            >
                              Realizar Pedido
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <MinimizedCart />
                  )}
                </div>
              )}
            </>
          );
        }