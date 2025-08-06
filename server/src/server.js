import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server as SocketIoServer } from 'socket.io';
import dbConnect from './config/db.js';

import authRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/message.routes.js"

import dotenv from "dotenv";

dotenv.config()

const app = express();
const server = http.createServer(app);
export const io = new SocketIoServer(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

dbConnect();

app.use("/messages", messageRouter);
app.use("/auth", authRouter);


io.on('connection', (socket) => {
  console.log('user connected:', socket.id);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});
