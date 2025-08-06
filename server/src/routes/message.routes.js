import express from "express";

import { verifyToken } from '../middleware/auth.middleware.js';
import { deleteMessage, getMessages, postMessage } from "../controllers/message.controller.js";


const router = express.Router();

// :id of the reciever
router.get("/:id", verifyToken, getMessages);

router.post("/", verifyToken, postMessage);

// id of the message to delete
router.delete("/:messageId", verifyToken, deleteMessage);

export default router;