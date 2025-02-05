import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './ReservasCard.css';

export default function ReservasCard({ order, updateOrderStatus }) {
    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    const handlePrintPDF = () => {
        // Crear PDF con tamaño personalizado (80mm x 150mm)
        const doc = new jsPDF({
            unit: 'mm', // Usamos milímetros
            format: [80, 150], // Ancho 80mm, Alto 150mm (típico ticket)
        });

        // Encabezado
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Ticket del Pedido', 40, 10, { align: 'center' });

        // Línea decorativa
        doc.setDrawColor(0, 123, 255);
        doc.setLineWidth(0.5);
        doc.line(5, 15, 75, 15);

        // Fecha y Hora
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Fecha y Hora: ${formatTimestamp(order.fecha_hora)}`, 5, 20);

        // Detalles del Pedido
        const tableData = order.productos.map((item) => [
            `${item.cantidad}x ${item.nombre}`,
            `$${(item.precio * item.cantidad).toFixed(2)}`,
        ]);

        doc.autoTable({
            startY: 25,
            head: [['Producto', 'Precio']],
            body: tableData,
            theme: 'plain', // Estilo limpio
            styles: {
                fontSize: 8,
                halign: 'center',
                textColor: [40, 40, 40],
            },
            headStyles: {
                fillColor: [0, 123, 255],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
            },
        });

        // Total
        const finalY = doc.autoTable.previous.finalY;
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(`Total: $${order.total}`, 5, finalY + 10);

        // Mensaje de agradecimiento
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('¡Gracias por su visita!', 40, finalY + 20, { align: 'center' });

        // Descargar PDF
        doc.save(`Ticket_Pedido_Mesa_${order.mesa_id}.pdf`);
    };

    return (
        <div className="order-details-card">
            <header>
                <div className="flex justify-between items-center">
                    <h3 className="text-xl">Mesa #{order.mesa_id}</h3>
                    <p className={`status ${order.estado}`}>{order.estado.toUpperCase()}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <p>{formatTimestamp(order.fecha_hora)}</p>
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
                            <span className="font-bold">${order.total}</span>
                        </div>
                    </div>
                    {(order.estado === 'pendiente' || order.estado === 'en-proceso') && (
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
                    )}
                </div>
                {/* Botón para imprimir el ticket */}
                <div className="mt-4">
                    <button
                        onClick={handlePrintPDF}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition transform hover:scale-105"
                    >
                        Imprimir Ticket
                    </button>
                </div>
            </div>
        </div>
    );
}
