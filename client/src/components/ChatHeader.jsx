import React from "react";
import { Link } from "react-router-dom";

function ChatHeader({ onToggleTheme }) {
  return (
    <div className="w-full rounded-2xl bg-white p-4 shadow-xl m-2 flex justify-between items-center">
      <h1 className="text-xl font-bold text-purple-600">MessageMe</h1>
      <div className="flex gap-4 items-center">
        <button
          onClick={onToggleTheme}
          className="bg-purple-100 text-purple-800 px-4 py-1 rounded-xl text-sm hover:cursor-pointer hover:bg-purple-200 transition"
        >
          Toggle Theme
        </button>
        <Link to="/profile">
        <button className="bg-purple-600 text-white px-4 py-1 rounded-xl text-sm hover:cursor-pointer hover:bg-purple-700 transition">
          See My Profile
        </button>
        </Link>
      </div>
    </div>
  );
}

export default ChatHeader;
