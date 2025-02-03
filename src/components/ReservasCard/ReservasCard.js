import React, { useState } from 'react';
import './Reservas.css';

const Reservas = () => {
  // Datos de ejemplo de reservas
  const reservas = [
    { id: 1, nombre: 'Juan Perez', fecha: '2023-10-01', hora: '14:00' },
    { id: 2, nombre: 'Maria Gomez', fecha: '2023-10-02', hora: '15:00' },
    { id: 3, nombre: 'Carlos Ruiz', fecha: '2023-10-03', hora: '16:00' },
    { id: 4, nombre: 'Ana Lopez', fecha: '2023-10-04', hora: '17:00' },
    { id: 5, nombre: 'Luis Torres', fecha: '2023-10-05', hora: '18:00' },
    { id: 6, nombre: 'Sofia Ramirez', fecha: '2023-10-06', hora: '19:00' },
    { id: 7, nombre: 'Pedro Sanchez', fecha: '2023-10-07', hora: '20:00' },
    { id: 8, nombre: 'Laura Diaz', fecha: '2023-10-08', hora: '21:00' },
    { id: 9, nombre: 'Miguel Angel', fecha: '2023-10-09', hora: '22:00' },
    { id: 10, nombre: 'Elena Castro', fecha: '2023-10-10', hora: '23:00' },
  ];

  // Estado para manejar la página actual
  const [paginaActual, setPaginaActual] = useState(1);
  const reservasPorPagina = 3;

  // Calcular el índice de las reservas a mostrar
  const indiceUltimaReserva = paginaActual * reservasPorPagina;
  const indicePrimeraReserva = indiceUltimaReserva - reservasPorPagina;
  const reservasActuales = reservas.slice(indicePrimeraReserva, indiceUltimaReserva);

  // Cambiar de página
  const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina);

  return (
    <div className="reservas-container">
      <h1>Reservas</h1>
      <ul className="reservas-list">
        {reservasActuales.map((reserva) => (
          <li key={reserva.id} className="reserva-item">
            <span>{reserva.nombre}</span>
            <span>{reserva.fecha} a las {reserva.hora}</span>
          </li>
        ))}
      </ul>
      <div className="paginacion">
        {Array.from({ length: Math.ceil(reservas.length / reservasPorPagina) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => cambiarPagina(i + 1)}
            className={paginaActual === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Reservas;