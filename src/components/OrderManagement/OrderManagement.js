'use client';
import { useEffect, useState, useCallback } from "react";
import './OrderManagement.css';
import { io } from "socket.io-client";

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const initSocket = async () => {
            try {
                console.log('🔄 Iniciando conexión Socket.IO...');
                
                const socketResponse = await fetch('/api/socketio');
                const socketData = await socketResponse.json();
                console.log('Respuesta del servidor Socket.IO:', socketData);
                
                const socketIo = io({
                  path: '/api/socketio',
                  addTrailingSlash: false,
                });

                console.log('🚀 Socket.IO iniciado:', socketIo);
            
                socketIo.on('connect', () => {
                  console.log('Socket conectado exitosamente');
                });
            
                socketIo.on('connect_error', (err) => {
                  console.log('Error de conexión Socket.IO:', {
                    message: err.message,
                    description: err.description,
                    type: err.type,
                    context: err.context
                  });
                });
            
                socketIo.on('error', (err) => {
                  console.log('Error general Socket.IO:', err);
                });
    
            socketIo.on("orderUpdate", (data) => {
              if (data.type === "NEW_ORDER") {
                setOrders(prevOrders => [...prevOrders, data.order]);
                alert(`Nuevo pedido recibido: Mesa ${data.order.tableNumber}`);
                console.log(`Nuevo pedido recibido: Mesa ${data.order.tableNumber}`);
              } else if (data.type === "UPDATE_ORDER") {
                setOrders(prevOrders =>
                  prevOrders.map(order =>
                    order.id === data.order.id ? data.order : order
                  )
                );
                alert(`Pedido actualizado: ${data.order.status}`);
                console.log(`Pedido actualizado: ${data.order.status}`);
              }
            });
    
            setSocket(socketIo);
    
            return () => {
              socketIo.disconnect();
            };
          } catch (error) {
            console.error('Error al inicializar socket:', error);
          }
        };
    
        initSocket();
      }, []);

    // Cargar pedidos iniciales
    useEffect(() => {
        const fetchInitialOrders = async () => {
          try {
            const response = await fetch('/api/pedidos');
            const data = await response.json();
            setOrders(data);
          } catch (error) {
            console.error('Error al cargar pedidos:', error);
            alert("No se pudieron cargar los pedidos");
          } finally {
            setLoading(false);
          }
        };
    
        fetchInitialOrders();
      }, []);
    

      const updateOrderStatus = useCallback(async (orderId, newStatus) => {
        try {
          const response = await fetch(`/api/pedidos/${orderId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
          });
    
          if (!response.ok) throw new Error('Error al actualizar el pedido');
          
          const updatedOrder = await response.json();
    
          if (socket?.connected) {
            socket.emit('updateOrderStatus', updatedOrder);
            console.log('Emitiendo actualización de estado:', updatedOrder);
          } else {
            console.warn('Socket no conectado al intentar actualizar estado');
          }
    
          setOrders(prevOrders =>
            prevOrders.map(order =>
              order.id === orderId
                ? { ...order, estado: newStatus }
                : order
            )
          );
    
          alert(`Estado Actualizado. Pedido #${orderId} actualizado a ${newStatus}`);
        } catch (error) {
          console.error('Error al actualizar estado:', error);
          alert(`No se pudo actualizar el estado del pedido #${orderId}`);
        }
      }, [socket]);

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

    const completedOrders = orders.filter(order => order.estado === 'completado');

    const pendingOrders = orders.filter(order => order.estado === 'pendiente' || order.estado === 'en-proceso');

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="gestion">
            <div className="gestion-full">
                <header>
                    <div className="text-2xl font-bold flex items-center gap-2">
                        <h2 className="h-6 w-6" />
                        Gestión de Pedidos en Tiempo Real
                    </div>
                </header>
                <div>
                    <div className="h-[600px] pr-4">
                        <div className="bg-yellow-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pendingOrders.map((order, index) => (
                                <div key={`${order.id}-${index}`} className="relative">
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
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <header>
                    <div className="text-2xl font-bold flex items-center gap-2">
                        <h2 className="h-6 w-6" />
                        PEDIDOS COMPLETADOS
                    </div>
                </header>
                <div className="h-[600px] pr-4">
                    <div className="bg-green-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {completedOrders.map((order) => (
                            <div key={order.id} className="relative">
                                <header>
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl">Mesa #{order.mesa_id}</h3>
                                        <p className="bg-green-500 text-white">COMPLETADO</p>
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
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
