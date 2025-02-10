'use client';

import { useState } from "react";

export default function ReservasPage({ noHayReservas }) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [personas, setPersonas] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleReserva = async (e) => {
    e.preventDefault();

    const reserva = {
      nombre,
      telefono,
      fecha,
      hora,
      personas: parseInt(personas, 10),
      comentarios
    };

    console.log("📤 Enviando reserva:", reserva);

    try {
      const response = await fetch("/api/reserva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserva),
      });

      if (!response.ok) throw new Error("Error al realizar la reserva");

      const data = await response.json();
      console.log("✅ Reserva creada:", data);

      setMensaje("Reserva realizada con éxito");
      setNombre(""); setTelefono(""); setFecha(""); setHora(""); setPersonas(""); setComentarios("");
    } catch (error) {
      console.error("❌ Error al reservar:", error);
      setMensaje("No se pudo realizar la reserva");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-400 to-orange-300 flex flex-col items-center p-6 text-white">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-shadow-lg">Reserva tu Lugar</h1>
      
      {noHayReservas && <p className="bg-white text-black p-3 rounded-xl shadow-md mb-6">No hay más reservas disponibles.</p>}
      
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-3xl p-8 text-gray-900 border-2 border-gray-300">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleReserva}>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            placeholder="Nombre y Apellido" 
            required={!noHayReservas}
            disabled={noHayReservas}
            className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
          />
          <input 
            type="tel" 
            value={telefono} 
            onChange={(e) => setTelefono(e.target.value)} 
            placeholder="Su Num. de teléfono" 
            required={!noHayReservas}
            disabled={noHayReservas}
            className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
          />
          <input 
            type="date" 
            value={fecha} 
            onChange={(e) => setFecha(e.target.value)} 
            required={!noHayReservas}
            disabled={noHayReservas}
            className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
          />
          <input 
            type="time" 
            value={hora} 
            onChange={(e) => setHora(e.target.value)} 
            required={!noHayReservas}
            disabled={noHayReservas}
            className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
          />
          <input 
            type="number" 
            value={personas} 
            onChange={(e) => setPersonas(e.target.value)} 
            min="1" 
            max="20" 
            required={!noHayReservas}
            disabled={noHayReservas}
            placeholder="Cantidad de personas" 
            className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
          />
          <textarea 
            value={comentarios} 
            onChange={(e) => setComentarios(e.target.value)} 
            placeholder="Exterior / Interior" 
            disabled={noHayReservas}
            className="p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
          />
          <button 
            type="submit" 
            disabled={noHayReservas}
            className="bg-orange-500 text-white py-3 rounded-xl shadow-lg hover:bg-orange-600 transition-all duration-300"
          >
            Reservar
          </button>
        </form>
      </div>
    </div>
  );
}
