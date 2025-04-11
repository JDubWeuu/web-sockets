import { Server } from "socket.io";
// import { io } from "./index.ts";
import { v4 as uuidv4 } from "uuid";

type Room = {
  id?: string;
  activeUsers: string[];
};

let rooms: Room[] = [];

export default function socketHandlers(io: Server) {
  io.use((socket, next) => {
    const val = socket.handshake.headers.authorization;
    if (JSON.stringify(val) === JSON.stringify("token")) {
      next();
    } else {
      throw Error("Unable to parse auth token. Please use a valid token");
    }
  });

  //   io.on("connection", (socket) => {
  //     socket.on("add", (num1, num2) => {
  //       let result = Number(num1) + Number(num2);
  //       console.log(result);
  //       io.emit("hello", String(result));
  //     });
  //     console.log("User connection with id:", socket.id);
  //     //   socket.broadcast.emit("hello", `Hello there, ${socket.id}`);

  //     //   this event is automatically called when the user disconnects from the socket
  //     socket.on("disconnect", () => {
  //       console.log("disconnected");
  //     });
  //   });

  io.on("connection", (socket) => {
    socket.on("create_or_join_room", (room: Room) => {
      if (room.id) {
        // join an active room
        socket.data.roomId = room.id;
        for (let activeRoom of rooms) {
          if (activeRoom.id === room.id) {
            activeRoom.activeUsers.push(socket.id);
            socket.join(room.id);
          }
        }
      } else {
        // create a new room
        const newRoom = { id: uuidv4(), activeUsers: [socket.id] };
        socket.data.roomId = newRoom.id;
        rooms.push(newRoom);
        socket.join(newRoom.id);
      }
      socket.emit("response", {
        roomId: socket.data.roomId,
      });
      if (socket.data.roomId) {
        io.to(socket.data.roomId).emit(
          "sendMessage",
          `The user ${socket.id} has joined the room.\nThere are currently ${
            rooms.filter((room) => room.id === socket.data.roomId)[0]
              .activeUsers.length
          } active users in this chat room.`
        );
      }
    });

    socket.on(
      "sendMessage",
      ({ roomId, message }: { roomId: string; message: string }) => {
        io.to(roomId).emit("sendMessage", {
          user: socket.id,
          content: message,
        });
      }
    );

    socket.on("disconnect", () => {
      socket.leave(socket.data.roomId);
      rooms = rooms.filter((room) => {
        if (room.activeUsers.includes(socket.id)) {
          room.activeUsers = room.activeUsers.filter((uid) => {
            return uid != socket.id;
          });
        }
        // if there's more than 0 users still in the room after a user disconnected from it, then keep it in the active rooms array
        return room.activeUsers.length > 0
      });
    });
  });
}
