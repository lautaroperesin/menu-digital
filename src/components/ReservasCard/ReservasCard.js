import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './ReservasCard.css';

export default function ReservasCard({ reserva, updateReservaStatus }) {
    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    const handlePrintPDF = () => {
        // Crear PDF con tamaño personalizado (80mm x 150mm)
        const doc = new jsPDF({
            unit: 'mm',
            format: [80, 150],
        });

        // Encabezado
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Ticket de Reserva', 40, 10, { align: 'center' });

        // Línea decorativa
        doc.setDrawColor(0, 123, 255);
        doc.setLineWidth(0.5);
        doc.line(5, 15, 75, 15);

        // Datos de la reserva
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Nombre: ${reserva.nombre}`, 5, 20);
        doc.text(`Teléfono: ${reserva.telefono}`, 5, 25);
        doc.text(`Fecha: ${reserva.fecha}`, 5, 30);
        doc.text(`Hora: ${reserva.hora}`, 5, 35);
        doc.text(`Personas: ${reserva.personas}`, 5, 40);

        // Mensaje de confirmación
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('¡Gracias por su reserva!', 40, 50, { align: 'center' });

        // Descargar PDF
        doc.save(`Reserva_${reserva.id}.pdf`);
    };

    return (
        <div className="reserva-details-card bg-white shadow-lg rounded-3xl p-6">
          <header className="mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold text-gray-900">Reserva #{reserva.id}</h3>
              <p className={`status text-sm font-medium py-1 px-4 rounded-full uppercase ${reserva.estado === 'pendiente' ? 'bg-yellow-300 text-yellow-800' : reserva.estado === 'confirmada' ? 'bg-green-300 text-green-800' : 'bg-red-300 text-red-800'}`}>
                {reserva.estado.toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <p>{formatTimestamp(reserva.fecha)}</p>
            </div>
          </header>
          <div className="space-y-6">
            <div className="space-y-4">
              <p><strong className="text-gray-700">Nombre:</strong> <span className="text-gray-900">{reserva.nombre}</span></p>
              <p><strong className="text-gray-700">Teléfono:</strong> <span className="text-gray-900">{reserva.telefono}</span></p>
              <p><strong className="text-gray-700">Fecha:</strong> <span className="text-gray-900">{reserva.fecha}</span></p>
              <p><strong className="text-gray-700">Hora:</strong> <span className="text-gray-900">{reserva.hora}</span></p>
              <p><strong className="text-gray-700">Personas:</strong> <span className="text-gray-900">{reserva.personas}</span></p>
              <p><strong className="text-gray-700">Zona:</strong> <span className="text-gray-900">{reserva.comentarios}</span></p>
            </div>
      
            {(reserva.estado === 'pendiente' || reserva.estado === 'confirmada') && (
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-gray-700 mb-2">Cambiar estado</label>
                <select
                  value={reserva.estado}
                  onChange={(e) => updateReservaStatus(reserva.id, e.target.value)}
                  className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            )}
          </div>
      
          <div className="mt-6 flex justify-center">
            <button
              onClick={handlePrintPDF}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-600 hover:shadow-lg transition transform hover:scale-105 focus:outline-none"
            >
              Imprimir Ticket
            </button>
          </div>
        </div>
      );
      
}
