'use client';

import ReservasCard from "@/components/ReservasCard/ReservasCard"; 
import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reservasHabilitadas, setReservasHabilitadas] = useState(true);  // Estado para controlar si las reservas están habilitadas

  const fetchReservas = async () => {
    try {
      const response = await fetch('/api/reserva'); 
      if (!response.ok) throw new Error("No se pudieron cargar las reservas");
      
      const data = await response.json();
      console.log("📡 Datos de reservas:", data); // Para depuración

      if (Array.isArray(data)) {
        setReservas(data);
      } else {
        setReservas([]); // Evita que el map falle
      }
    } catch (error) {
      console.error('Error al cargar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
    const interval = setInterval(fetchReservas, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDeshabilitarReservas = () => {
    setReservasHabilitadas(false);  // Cambia el estado para deshabilitar las reservas
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Administrar Reservas</h1>

      <button 
        onClick={handleDeshabilitarReservas} 
        className="bg-red-500 text-white py-2 px-4 rounded-lg mb-4"
      >
        Deshabilitar Reservas
      </button>

      {reservas.length === 0 ? (
        <p className="text-center text-gray-500">No hay reservas disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reservas.map(reserva => (
            reserva ? 
              <ReservasCard 
                key={reserva.id} 
                reserva={reserva} 
                reservasHabilitadas={reservasHabilitadas} // Pasa el estado a cada card
                updateOrderStatus={() => {}} 
              /> 
              : null
          ))}
        </div>
      )}
    </div>
  );
}
