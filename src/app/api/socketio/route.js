import { Server } from 'socket.io';
let io;

export async function GET(req) {
  if (!io) {
    console.log("Iniciando servidor WebSocket...");
    const server = req.nextUrl.server;
    io = new Server(server, {
      path: "/api/socketio",
    });

    io.on("connection", (socket) => {
      console.log("Cliente conectado:", socket.id);

      socket.on("newOrder", (order) => {
        io.emit("orderUpdate", { type: "NEW_ORDER", order });
      });

      socket.on("updateOrderStatus", (data) => {
        io.emit("orderUpdate", { type: "UPDATE_ORDER", order: data });
      });

      socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
      });
    });
  } else {
    console.log("Socket.IO ya está configurado.");
  }

  return new Response("Socket.IO configurado correctamente");
}