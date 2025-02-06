'use client';

import ReservasCard from "@/components/ReservasCard/ReservasCard"; 
import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar pedidos
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/reserva');
      if (!response.ok) throw new Error("No se pudieron cargar los pedidos");
      
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar pedidos iniciales y actualizar cada 10 segundos
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval); // Limpiar intervalo al desmontar
  }, []);

  // Función para actualizar estado del pedido
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/pedidos/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: newStatus }),
      });

      if (!response.ok) throw new Error('Error al actualizar el pedido');

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, estado: newStatus } : order
        )
      );

      console.log(`✅ Pedido #${orderId} actualizado a ${newStatus}`);
    } catch (error) {
      console.error('⚠️ Error al actualizar estado:', error);
    }
  };

  // Filtrar solo "libre" y "reservada"
  const mesasLibres = orders.filter(order => order.estado === 'libre');
  const mesasReservadas = orders.filter(order => order.estado === 'reservada');

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
        {mesasLibres.map(order => (
          <ReservasCard key={order.id} order={order} updateOrderStatus={updateOrderStatus} />
        ))}
      </div>

      <h2 className="font-bold mt-4 mb-3">Mesas Reservadas</h2>
      <div className="bg-yellow-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mesasReservadas.map(order => (
          <ReservasCard key={order.id} order={order} updateOrderStatus={updateOrderStatus} />
        ))}
      </div>
    </div>
  );
}
