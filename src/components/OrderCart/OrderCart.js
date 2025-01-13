import React, { useState } from "react";

export default function OrderCart({ cartItems,
    mesas,
    onClickMesa,
    onIncreaseQuantity, 
    onDecreaseQuantity, 
    onRemoveItem, 
    onSubmitOrder,
    orderSuccess }) {
        const [mesaSeleccionada, setMesaSeleccionada] = useState(null);

        const calculateTotal = () => {
            return cartItems.reduce((total, item) => {
                const itemSubtotal = parseFloat(item.subtotal);
                return total + itemSubtotal;
            }, 0);
        };

        const handleClick = (id) => {
            setMesaSeleccionada(id);
            onClickMesa(id);
          };

    return(
        <div className="container mx-auto p-4 sticky top-0 z-50 bg-white">
            {orderSuccess && (
                <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 bg-green-500 text-white">
                Pedido realizado con éxito
                </div>
            )}
            
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
                            <span className="font-semibold text-gray-800">${item.subtotal}</span>
                        </p>
                        </div>
                        <div className="flex items-center gap-2">
                        <button
                            className="w-8 h-8 flex items-center justify-center text-red-600 border border-red-600 rounded-full hover:bg-red-600 hover:text-white transition-colors"
                            onClick={() => onDecreaseQuantity(item.id)}
                        >
                            -
                        </button>
                        <p className="text-sm font-medium text-gray-800">{item.cantidad}</p>
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

            <div className="mesas flex flex-wrap justify-center gap-3 p-4 bg-gray-100 rounded-md shadow-md">
            {mesas.map((mesa) => (
                <button
                key={mesa.id}
                className={`px-4 py-2 text-sm font-bold rounded-md transition-colors duration-300 ${
                    mesaSeleccionada === mesa.id
                    ? "bg-orange-200 text-white"
                    : "bg-orange-200 text-gray-700 hover:bg-orange-400 hover:text-white"
                }`}
                onClick={() => handleClick(mesa.id)}
                >
                {mesa.nombre_mesa}
                </button>
            ))}
            </div>

            <div className="flex flex-col gap-4">
                <div className="w-full flex justify-between items-center">
                <span className="font-bold">Total:</span>
                <span className="text-xl font-bold">${calculateTotal()}</span>
                </div>
                <button
                className="w-full bg-yellow-500 text-black font-semibold py-2 rounded disabled:opacity-50 hover:bg-yellow-600"
                size="lg"
                disabled={cartItems.length === 0 || mesaSeleccionada === null}
                onClick={onSubmitOrder}
                >
                Realizar Pedido
                </button>
            </div>
        </div>
    );
}