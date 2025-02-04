'use client';

import { useState } from "react";

export default function ReservasPage() {
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);

  const mesas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const seleccionarMesa = (mesa) => {
    setMesaSeleccionada(mesa);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-400 to-orange-300 flex flex-col items-center p-6 text-white">
      <h1 className="text-4xl font-extrabold mb-6 drop-shadow-lg animate-bounce">Reserva tu Mesa</h1>
      
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-6 text-gray-900">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Nombre</label>
            <input type="text" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tu nombre" required />
          </div>
          
          <div>
            <label className="block font-semibold">Teléfono</label>
            <input type="tel" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tu teléfono" required />
          </div>
          
          <div>
            <label className="block font-semibold">Fecha</label>
            <input type="date" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          
          <div>
            <label className="block font-semibold">Hora</label>
            <input type="time" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          
          <div>
            <label className="block font-semibold">Cantidad de Personas</label>
            <input type="number" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Hasta 12 personas por mesa..." required min="1" />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold">Selecciona tu mesa</label>
            <div className="grid grid-cols-3 gap-4 p-2">
              {mesas.map((mesa) => (
                <div key={mesa} 
                  className={`relative cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl rounded-lg overflow-hidden ${mesaSeleccionada === mesa ? 'border-4 border-green-500' : ''}`}
                  onClick={() => seleccionarMesa(mesa)}>
                  <img src="https://img.freepik.com/vector-gratis/vista-aerea-mesa-restaurante-moderno-diseno-plano_23-2147905631.jpg?t=st=1738670900~exp=1738674500~hmac=298331e503bbfaf1e068b33208c7822187f376662a3d4323fc2bcdef302c9fa0&w=740" 
                    alt={`Mesa ${mesa}`} 
                    className="rounded-lg shadow-md" />
                  <span className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded opacity-75 transition-opacity duration-300">Mesa {mesa}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block font-semibold">Comentarios</label>
            <textarea className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Añade detalles adicionales"></textarea>
          </div>
          
          <div className="md:col-span-2 flex justify-end">
            <button className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-transform">Reservar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
