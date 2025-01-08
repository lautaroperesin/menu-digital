import { Server } from 'socket.io';

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket ya está configurado');
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Escuchar nuevos pedidos
    socket.on('newOrder', (order) => {
      // Emitir el nuevo pedido a todos los clientes conectados
      io.emit('orderUpdate', { type: 'NEW_ORDER', order });
    });

    // Escuchar actualizaciones de estado
    socket.on('updateOrderStatus', (data) => {
      // Emitir la actualización a todos los clientes conectados
      io.emit('orderUpdate', { type: 'UPDATE_ORDER', order: data });
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });
  });

  console.log('Configurando socket');
  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};