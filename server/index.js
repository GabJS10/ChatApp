import express from "express";
import http from "http";
import { Server } from "socket.io";
import { sequelize } from "./src/database/database.js";
import { Sessions } from "./src/models/sessions.js";
import  SessionMessage  from "./src/models/sessionMessage.js";
import crypto from "crypto";

const ramdomid = () => crypto.randomBytes(8).toString("hex");

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.use(async (socket, next) => {
  const sessionId = socket.handshake.auth.sessionId;
  const username = socket.handshake.auth.username;
  
  if (sessionId) {
    const session = await Sessions.findByPk(sessionId)
    session.set({connected:true})
    session.save()
    if (session) {
      socket.sessionId = sessionId;
      socket.userId = session.userId;
      socket.username = session.username;
      return next();
    }
  }

  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  socket.userId = ramdomid();
  socket.sessionId = ramdomid();
  next();
});

io.on("connection", async (socket) => {
  const s = await Sessions.findOne({ where: { sessionId: socket.sessionId } });
  if (s === null) { 
    await Sessions.create({
      userId: socket.userId,
      sessionId: socket.sessionId,
      username: socket.username,
      connected: true,
    });
  }

  socket.emit("session", {
    userId: socket.userId,
    sessionId: socket.sessionId,
    username: socket.username,
  });

  socket.join(socket.userId)

  //listing all users and send to the client

  const users = [];
  //const messagePerUser = new Map();

  const sessions = await Sessions.findAll();
  console.log(sessions);  

  const messages = await SessionMessage.findMessagesPerUser(socket.userId);
   
  sessions.forEach((session) => { 
    users.push({ 
      userId: session.userId,
      username: session.username,
      connected: session.connected,
    });
  }); 

  socket.emit("users", users, messages);

  console.log("new user connected: " + socket.username);

  socket.broadcast.emit("user connected", {
    userId: socket.userId,
    username: socket.username,
  });

  socket.on("message", ({ content, to, files }) => { 
    console.log("message received: " + content);
    socket.to(to).to(socket.userId).emit("message_response", {
      content,
      fromSelf: true ? to === socket.userId : false,
      from: socket.userId,
      to: to,
      files,
    });

    SessionMessage.create({  
      content: content, 
      fromSelf: true ? to === socket.userId : false,
      from: socket.userId,
      to: to,
      files,
    });


  });

  socket.on("logout", async ( sessionId ) => {
    await Sessions.destroy({ where: { sessionId: socket.sessionId } });
  })

  socket.on("disconnect", async () => {
    const match = await io.in(socket.id).fetchSockets();
    const isDisconnected = match.length === 0;

    if (isDisconnected) {
      await Sessions.update(
        { connected: false },
        { where: { sessionId: socket.sessionId } }
      );

      socket.broadcast.emit("user disconnected", {
        userId: socket.userId,
      });
    }
    console.log("user disconnected: " + socket.username);
  });
});

async function main() {
  try {
    httpServer.listen(3000, () => {
      console.log("listening on http://localhost:3000");
    });
    await sequelize.sync({ force: false });
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
}

main();
