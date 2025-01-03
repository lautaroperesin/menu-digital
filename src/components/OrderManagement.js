'use client';
import { useEffect, useState } from "react";

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const ws = new WebSocket('ws://tu-servidor-websocket');
  
      ws.onopen = () => {
        console.log('Conectado al servidor de pedidos');
        setLoading(false);
      };

      ws.onmessage = (event) => {
        const newOrder = JSON.parse(event.data);
        if (newOrder.type === 'NEW_ORDER') {
          setOrders(prevOrders => [...prevOrders, newOrder.order]);
          toast({
            title: "Nuevo Pedido",
            description: `Mesa #${newOrder.order.mesa_id} ha realizado un nuevo pedido`,
          });
        } else if (newOrder.type === 'UPDATE_ORDER') {
          setOrders(prevOrders => 
            prevOrders.map(order => 
              order.id === newOrder.order.id ? newOrder.order : order
            )
          );
        }
      };

       // Cargar pedidos iniciales
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

    return () => {
      ws.close();
    };
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/pedidos/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Error al actualizar el pedido');

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, estado: newStatus }
            : order
        )
      );

      alert("Estado Actualizado");
    } catch (error) {
      console.error('Error:', error);
      alert("No se pudo actualizar el estado del pedido");
    }
  };


    // useEffect(() => {
    //     fetch('/api/pedidos')
    //         .then(response => response.json())
    //         .then(data => setOrders(data));
    // }, []);

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

      if (loading) {
        return (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        );
      }

      return (
        <div className="p-4">
          <div className="w-full">
            <header>
              <div className="text-2xl font-bold flex items-center gap-2">
                <h2 className="h-6 w-6" />
                Gestión de Pedidos en Tiempo Real
              </div>
            </header>
            <div>
              <div className="h-[600px] pr-4">
                <div className="bg-yellow-50  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orders.map((order) => (
                    <div key={order.id} className="relative">
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
                              <span className="font-bold">{order.total}</span>
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
          </div>
        </div>
      );
}