'use client';

import ReservasCard from "@/components/ReservasCard/ReservasCard"; 
import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
  
        alert(`Estado Actualizado. Pedido #${orderId} actualizado a ${newStatus}`);
      } catch (error) {
        console.error('Error al actualizar estado:', error);
        alert(`No se pudo actualizar el estado del pedido #${orderId}`);
      }
    };

    const completedOrders = orders.filter(order => order.estado === 'completado' && new Date(order.fecha_hora).toDateString() === new Date().toDateString());

    const pendingOrders = orders.filter(order => order.estado === 'pendiente');

    const inProcessOrders = orders.filter(order => order.estado === 'en-proceso');

    if (loading) {
      return (
          <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
      );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Reservas de Mesas</h1>
      
      <h2 className="font-bold mt-4 mb-3">Mesas Disponibles</h2>
      <div className="bg-yellow-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pendingOrders.map((order, index) => (
          <ReservasCard key={index} order={order} updateOrderStatus={updateOrderStatus} />
        ))}
      </div>

      <h2 className="font-bold mt-4 mb-3">Mesas Ocupadas</h2>
      <div className="bg-yellow-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inProcessOrders.map((order, index) => (
          <ReservasCard key={index} order={order} updateOrderStatus={updateOrderStatus} />
        ))}
      </div>
      
    </div>
  );
}