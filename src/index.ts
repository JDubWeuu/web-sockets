import express from "express";
import type { Request, Response, NextFunction } from "express";
// import type { ServerToClientEvents, SocketData } from './socket-types/types';
import { Server } from "socket.io";
import http from 'http';
import socketHandlers from "./sockets.ts";

const app = express();
const server = http.createServer(app);
export const io = new Server(server);
socketHandlers(io);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.set("Content-Type", "text/html");
  res.status(200).send("<input />");
});

// io.on("connection", (socket) => {
//   socket.on("add", (num1, num2) => {
//     let result = Number(num1) + Number(num2);
//     console.log(result);
//     socket.broadcast.emit(String(result));
//   });
//   console.log("User connection with id:", socket.id);
//   socket.broadcast.emit("hello");

//   //   this event is automatically called when the user disconnects from the socket
//   socket.on("disconnect", () => {
//     console.log("disconnected");
//   });
// });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("App is up and running!");
});
