import { Server } from 'socket.io';
import { NextResponse } from 'next/server';

let io;

export async function GET(req) {
  if (!io) {
    // Obtener el servidor HTTP subyacente
    const res = new NextResponse();
    const httpServer = res.socket?.server;

    if (httpServer) {
      io = new Server(httpServer, {
        path: '/api/socketio',
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
          credentials: true,
        },
        transports: ['polling', 'websocket'],
        maxHttpBufferSize: 1e8,
        pingTimeout: 60000
      });

      res.socket.server.io = io;

      io.on('connection', socket => {
        console.log('🟢 Cliente conectado:', socket.id);

        socket.on('newOrder', (order) => {
          console.log('📝 Nuevo pedido recibido:', order);
          io.emit('orderUpdate', { type: 'NEW_ORDER', order });
        });

        socket.on('updateOrderStatus', (data) => {
          console.log('🔄 Actualización de estado recibida:', data);
          io.emit('orderUpdate', { type: 'UPDATE_ORDER', order: data });
        });

        socket.on('error', (error) => {
          console.error('🔴 Error en socket:', error);
        });

        socket.on('disconnect', () => {
          console.log('🔴 Cliente desconectado:', socket.id);
        });
      });
    }
  }

  return NextResponse.json({ 
    success: true, 
    message: 'Socket.IO server running'
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};