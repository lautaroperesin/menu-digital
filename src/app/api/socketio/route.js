import { Server } from 'socket.io';
import { NextResponse } from 'next/server';

const initSocket = () => {
  if (!global.io) {
    console.log('Inicializando Socket.IO...');
    global.io = new Server({
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NODE_ENV === 'development'
          ? "http://localhost:3000"
          : undefined,
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    // Configurar eventos del socket
    global.io.on('connection', (socket) => {
      console.log('Cliente conectado:', socket.id);
      
      socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
      });

      // Aquí puedes agregar más eventos
      socket.on('newOrder', (orderData) => {
        console.log('Nuevo pedido recibido:', orderData);
        // Procesar el pedido y notificar a todos los clientes
        global.io.emit('orderUpdate', { ...orderData, status: 'received' });
      });
    });
  }
  return global.io;
};

export async function GET(req) {
  try {
    const io = initSocket();
    return NextResponse.json({ 
      success: true, 
      message: 'Socket inicializado correctamente' 
    });
  } catch (error) {
    console.error('Error al inicializar socket:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al inicializar socket' 
      },
      { 
        status: 500 
      }
    );
  }
}