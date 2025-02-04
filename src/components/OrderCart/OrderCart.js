import Link from "next/link";
import React, { useState, useEffect } from "react";
import { RiArrowDownDoubleFill, RiArrowUpDoubleFill  } from "react-icons/ri";

export default function OrderCart({ cartItems,
    onIncreaseQuantity, 
    onDecreaseQuantity, 
    onRemoveItem, 
    orderSuccess }) {
        const [isSticky, setIsSticky] = useState(false);
        const [isExpanded, setIsExpanded] = useState(true);

        useEffect(() => {
            setIsSticky(cartItems.length > 0);
          }, [cartItems]);

        const calculateTotal = () => {
            return cartItems.reduce((total, item) => {
                const itemSubtotal = parseFloat(item.subtotal);
                return total + itemSubtotal;
            }, 0);
        };

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
        
                          {/* Boton de ver pedido */}
                          <div className="mt-4">
                            <div className="w-full flex justify-between items-center">
                              <span className="font-bold">Total:</span>
                              <span className="text-xl font-bold">${calculateTotal()}</span>
                            </div>
                            <button
                              className="w-full bg-yellow-500 text-black font-semibold py-2 rounded disabled:opacity-50 hover:bg-yellow-600"
                              disabled={cartItems.length === 0}
                            >
                              Ver Pedido
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