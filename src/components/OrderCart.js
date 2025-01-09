export default function OrderCart({ cartItems, 
    onIncreaseQuantity, 
    onDecreaseQuantity, 
    onRemoveItem, 
    onSubmitOrder,
    orderSuccess }) {
        const calculateTotal = () => {
            return cartItems.reduce((total, item) => {
                const itemSubtotal = parseFloat(item.subtotal);
                return total + itemSubtotal;
            }, 0);
        };

    return(
        <div className="container mx-auto p-4">
            {orderSuccess && (
                <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 bg-green-500 text-white">
                Pedido realizado con éxito
                </div>
            )}
            
            <div className="col-span-1">
                <h2 className="flex items-center gap-2">
                Pedido Actual
                </h2>
            <div className="flex items-center justify-between gap-2 p-2 border rounded">
                {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center">No hay productos seleccionados</p>
                ) : (
                <div className="space-y-4">
                    {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-2 p-2 border rounded">
                        <div>
                        <h3 className="font-medium">{item.nombre}</h3>
                        <p className="text-sm text-gray-600">
                            ${item.precio} x {item.cantidad} = ${item.subtotal}
                        </p>
                        </div>
                        <div className="flex items-center gap-2">
                        <button
                            size="sm"
                            variant="outline"
                            onClick={() => onDecreaseQuantity(item.id)}
                        >
                            <span className="w-4 h-4 text-red-600">-</span>
                        </button>
                        <p>{item.cantidad}</p>
                        <button
                            size="sm"
                            variant="outline"
                            onClick={() => onIncreaseQuantity(item)}
                        >
                            <span className="w-4 h-4 text-green-600">+</span>
                        </button>
                        <button
                            size="sm"
                            variant="destructive"
                            onClick={() => onRemoveItem(item.id)}
                        >
                            <span className="w-4 h-4 text-red-800">Eliminar</span>
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
            <div className="flex flex-col gap-4">
                <div className="w-full flex justify-between items-center">
                <span className="font-bold">Total:</span>
                <span className="text-xl font-bold">${calculateTotal()}</span>
                </div>
                <button
                className="w-full bg-yellow-500 text-black font-semibold py-2 rounded disabled:opacity-50 hover:bg-yellow-600"
                size="lg"
                disabled={cartItems.length === 0}
                onClick={onSubmitOrder}
                >
                Realizar Pedido
                </button>
            </div>
        </div>
        </div>
    );
}