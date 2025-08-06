import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.middleware.js";


export const signup = async (req, res) => {
    try{
        const { username, email, password } = req.body;
        if(!username || !email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        if(password.length < 6){
            return res.status(400).json({ message: "Password should be minimum 6 character" })
        }
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(409).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    }catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if(!user){
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.status(200).json({ token });
    }catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const whoami = async (req, res, next) => {
    try{
        verifyToken(req, res, next);
        if(req.user){
            res.status(200).json({ res: req.user });

        }
    }catch(error){
        res.status(500).json({ message: "Server error", error: error.message });

    }
}