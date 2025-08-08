import express from "express";

import { getAvatars, login, otherUserInfo, signup, whoami, updateProfile, getUsers } from ".././controllers/auth.controller.js"
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/updateProfile",verifyToken, updateProfile)
router.get("/whoami", verifyToken, whoami);
router.get("/otherUserInfo", otherUserInfo);
router.get("/getAvatars", getAvatars);
router.get("/getUsers", verifyToken, getUsers);

export default router;