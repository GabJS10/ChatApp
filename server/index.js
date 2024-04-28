import { log } from "console";
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  console.log("new user connected: " + socket.username);

  //listing all users and send to the client

  const users = [];

  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userId: id,
      username: socket.username,
    });
  }

  socket.emit("users", users);

  socket.broadcast.emit("user connected", {
    userId: socket.id,
    username: socket.username,
  });

  socket.on("message", ({ content, to }) => {
    console.log("message received: " + content);
    socket.to(to).emit("message_response", {
      content,
      fromSelf: false,
      from: socket.id,
      to: to,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected: " + socket.username);
    socket.broadcast.emit("user disconnected", {
      userId: socket.id,
    });
  });
});

httpServer.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
