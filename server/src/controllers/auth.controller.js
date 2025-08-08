import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.middleware.js";



const avatars = [
    "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light",

    "https://avataaars.io/?avatarStyle=Circle&topType=WinterHat1&accessoriesType=Blank&hatColor=Red&hairColor=Blue&facialHairType=Blank&clotheType=ShirtCrewNeck&clotheColor=Gray01&eyeType=Surprised&eyebrowType=UpDownNatural&mouthType=Tongue&skinColor=Light",

    "https://avataaars.io/?avatarStyle=Circle&topType=LongHairCurvy&accessoriesType=Prescription01&hatColor=Pink&hairColor=Black&facialHairType=BeardMajestic&facialHairColor=BrownDark&clotheType=Overall&clotheColor=Gray02&eyeType=Squint&eyebrowType=Angry&mouthType=Sad&skinColor=Tanned",

    "https://avataaars.io/?avatarStyle=Circle&topType=Turban&accessoriesType=Sunglasses&hatColor=PastelBlue&hairColor=Red&facialHairType=BeardLight&facialHairColor=Auburn&clotheType=Hoodie&clotheColor=PastelBlue&eyeType=Default&eyebrowType=UpDownNatural&mouthType=Twinkle&skinColor=Light",

    "https://avataaars.io/?avatarStyle=Circle&topType=WinterHat2&accessoriesType=Round&hatColor=Gray02&hairColor=Platinum&facialHairType=BeardMajestic&facialHairColor=BrownDark&clotheType=GraphicShirt&clotheColor=Heather&graphicType=Skull&eyeType=WinkWacky&eyebrowType=SadConcerned&mouthType=Twinkle&skinColor=DarkBrown",

    "https://avataaars.io/?avatarStyle=Circle&topType=Hat&accessoriesType=Prescription02&hairColor=Red&facialHairType=BeardMajestic&facialHairColor=Red&clotheType=ShirtVNeck&clotheColor=PastelOrange&eyeType=Surprised&eyebrowType=UnibrowNatural&mouthType=Grimace&skinColor=Pale"
]

export const signup = async (req, res) => {
    try {
        const { username, email, password, avatar_url } = req.body;

        if (!username || !email || !password || !avatar_url) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password should be minimum 6 character" })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword, avatar_url });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" });

        res.status(201).json({ token, user, message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,           
            sameSite: "none",       
            maxAge: 2 * 60 * 60 * 1000 
        });

        res.status(200).json({ token, user });


    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { username, bio, email, avatar_url } = req.body;
        const { userId } = req.user;

        if (!username || !bio || !avatar_url) {
            return res.status(400).json({ message: "Username and bio are required." });
        }

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, bio, email, avatar_url },
            { new: true, select: "-password" } // Return the updated doc, exclude password
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const whoami = async (req, res, next) => {
    try {

        const userId = req.user?.userId;
        console.log(userId)
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(userId).select("-password"); // Avoid sending password

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });

    }
}

export const otherUserInfo = async (req, res) => {
    try {
        const { receiverId } = req.body;
        if (receiverId) {
            return res.status(400).json({ message: "Please provide the receiverId(bad request)" });
        }
        const user = await User.findById(receiverId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Invalid credentials" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });

    }
}

export const getUsers = async (req, res) => {
    try {
        const currentUserId = req.user.userId;

        if (!currentUserId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const users = await User.find({ _id: { $ne: currentUserId } }).select(
            "_id username avatar_url email bio"
        );

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getAvatars = async (req, res) => {
    try {
        // console.log("endpoint for avatar hit")
        res.status(200).json(Object.values(avatars));
    } catch (error) {
        res.status(500).json({ message: "Error getting avatars", error: error.message });
    }
};
