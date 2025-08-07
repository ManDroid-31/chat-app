import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server as SocketIoServer } from 'socket.io';
import dbConnect from './config/db.js';

import authRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/message.routes.js"
import { sendPushNotification } from "./firebase.js";


import dotenv from "dotenv";
import User from './models/User.js';

dotenv.config()

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const app = express();
const server = http.createServer(app);


app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true
  }
  ));


export const io = new SocketIoServer(server, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

( async () => await dbConnect())();

app.use("/messages", messageRouter);
app.use("/auth", authRouter);


const onlineUsers = new Set();


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    socket.userId = userId; // store for disconnect
    onlineUsers.add(userId);
    io.emit("take-online-users", Array.from(onlineUsers)); // send to all
  });

  socket.on("send-message", async (data) => {
  const receiverId = data.receiver;
  const senderId = data.sender;

  console.log("sent the notification")
  if (onlineUsers.has(receiverId)) {
    socket.to(receiverId).emit("receive-message", data);
  } else {
    const user = await User.findById(receiverId);
    const sender = await User.findById(senderId);
    if (user?.fcm_token) {
      
      await sendPushNotification(user.fcm_token, {
        title: `New message from ${sender?.username}`,
        body: data.text,
      });
    }
  }
});



  // firebase token
  socket.on("register_fcm_token", async ({ userId, fcmToken }) => {
    try {
      if (!userId || !fcmToken) return;
      const fcm_token = fcmToken;

      await User.updateOne(
        { _id: userId },
        { $set: { fcm_token } }, 
        { upsert: true }
      );

      // console.log("FCM token saved for user", userId, fcm_token); //works
    } catch (err) {
      console.error("Error saving FCM token:", err);
    }
  })

    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit("take-online-users", Array.from(onlineUsers));
      }
      console.log("User disconnected:", socket.id);
    });
  });


  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`);
  })
