import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [username, setUsername] = useState("");
    const [avatar_url, setAvatarUrl] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatars, setAvatars] = useState([]);
    const navigate = useNavigate();

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

    useEffect(() => {
        const fetchAvatars = async () => {
            try {
                const res = await fetch(`${BASE_URL}/auth/getAvatars`);
                const data = await res.json();
                // console.log(data) //returns array or urls
                if (Array.isArray(data)) {
                    setAvatars(data);
                }
            } catch (err) {
                console.error("Failed to load avatars:", err);
            }
        };

        fetchAvatars();
    }, []);

    const handleSignup = async (e) => {
        e.preventDefault();

        if (username && email && password && avatar_url) {
            try {
                const res = await fetch(`${BASE_URL}/auth/signup`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password, avatar_url }),
                });

                const data = await res.json();
                if (res.ok) {
                    toast.success("signed-up successfully")
                    localStorage.setItem("token", data.token);
                    navigate("/");
                } else {
                    alert(data.message || "Signup failed.");
                }
            } catch (error) {
                toast.error(error.message)
                console.error(error);
            }
        } else {
            toast.error("Please ensure all fields are filled")
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSignup}
                className="bg-white shadow-2xl rounded-xl px-8 py-10 w-full max-w-md space-y-6"
            >
                <h2 className="text-2xl font-bold text-purple-600 text-center">Sign Up</h2>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                //   required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                //   required
                />

                <input
                    type="password"
                    placeholder="Password (min 6 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                //   required
                />

                {/* Avatar Selection Grid */}
                <div>
                    <p className="text-gray-600 font-medium mb-2">Choose an Avatar:</p>
                    <div className="grid grid-cols-3 gap-3">
                        {avatars.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`Avatar ${index + 1}`}
                                className={`w-16 h-16 rounded-full cursor-pointer border-4 transition ${avatar_url === url
                                        ? "border-purple-600 scale-105"
                                        : "border-transparent"
                                    }`}
                                onClick={() => setAvatarUrl(url)}
                            />
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:cursor-pointer hover:bg-purple-700 transition"
                >
                    Create Account
                </button>

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-purple-600 cursor-pointer font-medium hover:underline"
                    >
                        Log in
                    </span>
                </p>
            </form>
        </div>
    );
}

export default Signup;
