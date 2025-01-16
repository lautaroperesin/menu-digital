import './OrderDetailsCard.css';

export default function OrderDetailsCard({ order, updateOrderStatus }) {
    const getStatusColor = (status) => {
        const colors = {
            'pendiente': 'bg-yellow-500',
            'en-proceso': 'bg-blue-500',
            'completado': 'bg-green-500'
        };
        return colors[status] || 'bg-gray-500';
    };

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString();
    };

    return (
    <div className="order-details-card">
        <header>
            <div className="flex justify-between items-center">
                <h3 className="text-xl">Mesa #{order.mesa_id}</h3>
                <p className={`${getStatusColor(order.estado)} text-white`}>
                    {order.estado.toUpperCase()}
                </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <p className="h-4 w-4" />
                {formatTimestamp(order.fecha_hora)}
            </div>
        </header>
        <div>
            <div className="space-y-4">
                <div className="space-y-2">
                    {order.productos.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                            <span>{item.cantidad}x {item.nombre}</span>
                            <span className="font-medium">${(item.precio * item.cantidad).toFixed(2)}</span>
                        </div>    
                    ))}
                </div>
                <div className="pt-4 border-t flex justify-between items-center">
                    <span className="font-bold">Total</span>
                    <div className="flex items-center gap-1">
                        <p className="h-4 w-4" />
                        <span className="font-bold">${order.total}</span>
                    </div>
                </div>
                {(order.estado === 'pendiente' || order.estado === 'en-proceso') && (
                      <div className="pt-4 border-t">
                      <select
                          value={order.estado}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      >
                          <option value="pendiente">Pendiente</option>
                          <option value="en-proceso">En Preparación</option>
                          <option value="completado">Completado</option>
                      </select>
                  </div>
                )}
            </div>
        </div>
    </div>
    );
}