'use client';

import { useState } from "react";

export default function ReservasPage() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [personas, setPersonas] = useState("");
  const [ubicacion, setUbicacion] = useState(null);
  const [comentarios, setComentarios] = useState("");

  const handleReserva = async (e) => {
    e.preventDefault();

    const reserva = {
      nombre,
      telefono,
      fecha,
      hora,
      personas,
      ubicacion,
      comentarios
    };

    try {
      const response = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserva),
      });

      if (!response.ok) throw new Error("Error al realizar la reserva");

      alert("Reserva realizada con éxito");
    } catch (error) {
      console.error("Error al reservar:", error);
      alert("No se pudo realizar la reserva");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-400 to-orange-300 flex flex-col items-center p-6 text-white">
      <h1 className="text-4xl font-extrabold mb-6">Reserva tu Lugar</h1>
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-6 text-gray-900">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleReserva}>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" required />
          <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Tu teléfono" required />
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />
          <input type="number" value={personas} onChange={(e) => setPersonas(e.target.value)} min="1" required placeholder="Cantidad de personas" />
          <textarea value={comentarios} onChange={(e) => setComentarios(e.target.value)} placeholder="Comentarios"></textarea>
          <button type="submit" className="bg-orange-500 text-white p-2 rounded">Reservar</button>
        </form>
      </div>
    </div>
  );
}
