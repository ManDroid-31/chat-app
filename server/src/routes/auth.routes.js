import express from "express";

import { login, signup, whoami } from "../controllers/auth.controller.js"

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/whoami", whoami);

export default router;