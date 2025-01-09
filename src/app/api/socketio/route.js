// import { Server } from 'socket.io';
// import { NextResponse } from 'next/server';

// let io;

// export async function GET(req) {
//   if (!io) {
//     // Obtener el servidor HTTP subyacente
//     const res = new NextResponse();
//     const httpServer = res.socket?.server;

//     if (httpServer) {
//       io = new Server(httpServer, {
//         path: "/api/socketio",
//         addTrailingSlash: false,
//         cors: {
//           origin: "*",
//           methods: ["GET", "POST"]
//         }
//       });

//       io.on("connection", (socket) => {
//         console.log("Cliente conectado:", socket.id);

//         socket.on("newOrder", (order) => {
//           io.emit("orderUpdate", { type: "NEW_ORDER", order });
//           console.log("Nuevo pedido emitido:", order);
//         });

//         socket.on("updateOrderStatus", (data) => {
//           io.emit("orderUpdate", { type: "UPDATE_ORDER", order: data });
//           console.log("Estado actualizado emitido:", data);
//         });

//         socket.on("disconnect", () => {
//           console.log("Cliente desconectado:", socket.id);
//         });
//       });
//     }
//   }

//   return NextResponse.json({ success: true });
// }