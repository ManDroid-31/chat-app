import React from "react";
import {Trash} from "lucide-react"

function MessageBox({ message, isSender, onDelete }) {
  return (
    <div
      className={`flex ${isSender ? "justify-end" : "justify-start"} w-full`}
    >
      <div
        className={`relative p-4 rounded-xl max-w-[70%] shadow-md flex gap-2 ${
          isSender ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        <p>{message?.content || message?.text}</p>

      </div>
    </div>
  );
}

export default MessageBox;
