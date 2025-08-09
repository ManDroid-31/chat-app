import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server as SocketIoServer } from 'socket.io';
import dbConnect from './config/db.js';

import authRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/message.routes.js";
import { sendPushNotification } from "./firebase.js";

import dotenv from "dotenv";
import User from './models/User.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'https://chat-app-lyart-ten.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'https://localhost:5173'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
  }
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Cache-Control'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

export const io = new SocketIoServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
    transports: ['websocket', 'polling']
  },
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/test-cors', (req, res) => {
  res.json({ 
    message: 'CORS is working!',
    origin: req.headers.origin
  });
});

(async () => {
  try {
    await dbConnect();
  } catch (error) {
    console.error('Database connection failed:', error);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
})();

app.use("/auth", authRouter);
app.use("/messages", messageRouter);

const onlineUsers = new Set();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    if (!userId) return;
    socket.join(userId);
    socket.userId = userId;
    onlineUsers.add(userId);
    io.emit("take-online-users", Array.from(onlineUsers));
  });

  socket.on("send-message", async (data) => {
    try {
      const { receiver, sender, content, text } = data;
      if (!receiver || !sender) return;

      if (onlineUsers.has(receiver)) {
        socket.to(receiver).emit("receive-message", data);
      } else {
        try {
          const user = await User.findById(receiver);
          const senderUser = await User.findById(sender);

          if (user?.fcm_token && senderUser) {
            await sendPushNotification(user.fcm_token, {
              title: `New message from ${senderUser.username}`,
              body: content || text || 'New message',
            });
          }
        } catch (err) {
          console.error("Push notification error:", err);
        }
      }
    } catch (err) {
      console.error("Error processing message:", err);
    }
  });

  socket.on("register_fcm_token", async ({ userId, fcmToken }) => {
    if (!userId || !fcmToken) return;
    try {
      await User.updateOne(
        { _id: userId },
        { $set: { fcm_token: fcmToken } }
      );
    } catch (err) {
      console.error("Error saving FCM token:", err);
    }
  });

  socket.on("disconnect", () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit("take-online-users", Array.from(onlineUsers));
    }
  });
});

app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 5000;



server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port: ${PORT}`);
});