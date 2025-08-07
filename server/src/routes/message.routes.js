import express from "express";

import { verifyToken } from '../middleware/auth.middleware.js';
import { deleteMessage, getMessages, postMessage } from "../controllers/message.controller.js";


const router = express.Router();

router.post('/send', verifyToken, postMessage);
router.get('/:userId', verifyToken, getMessages);
router.delete('/:messageId', verifyToken, deleteMessage);
// router.put('/:userId', markMessagesAsRead); // TODO

export default router;