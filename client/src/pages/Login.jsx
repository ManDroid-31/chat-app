import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      toast.loading("Logging in...");
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      toast.dismiss(); // dismiss loading toast

      const data = await res.json();

      if (res.ok && data.token) {
        // console.log(data.token) //works fine 
        localStorage.setItem("token", data.token);
        toast.success("Login successful 🎉");
        dispatch(loginSuccess({user: data.user, token: data.token}))
        navigate("/");
      } else {
        toast.error(data.message || "Invalid credentials");
      }

    } catch (error) {
      console.error("Login error:", error);
      toast.dismiss();
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-2xl rounded-xl px-8 py-10 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-purple-600 text-center">Login</h2>

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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        //   required
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Sign In
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-purple-600 cursor-pointer font-medium hover:underline"
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
