import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, selectUser } from "../redux/slices/chatSlice";
import ChatHeader from "./ChatHeader";
import ChatTopbar from "./ChatTopBar.jsx";
import MessageBox from "./MessageBox.jsx";

function ChatContainer() {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const [messageText, setMessageText] = useState("");
  
  const { selectedUser, messages } = useSelector(state => state.chat);

  const createMessage = () => {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage || !selectedUser) return;

    const newMessage = {
      receiverId: selectedUser._id,
      text: trimmedMessage,
    };

    dispatch(addMessage(newMessage));
    setMessageText("");
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      createMessage();
    }
  };

  const scrollToLatestMessage = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isMessageFromCurrentUser = (msg) => {
    return msg.receiverId !== selectUser._id;
  };

  useEffect(() => {
    scrollToLatestMessage();
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-xl">
        Select a user to start chatting 💬
      </div>
    );
  }

  return (
    <div className="shadow-2xl hover:shadow-yellow-500 transition flex-1 flex flex-col m-4 p-4 rounded-2xl bg-gray-50 h-screen">
      <ChatHeader onToggleTheme={() => alert("Theme toggled")} />
      <ChatTopbar selectedUser={selectedUser} />

      <main className="flex-1 p-6 flex flex-col bg-white rounded-b-xl shadow-inner overflow-y-auto space-y-4">
        {messages.map((msg,idx) => (
          <MessageBox
            key={idx}
            message={msg}
            isSender={isMessageFromCurrentUser(msg)}
            onDelete={() => {}}
          />
        ))}
        <div ref={messagesEndRef} />
      </main>

      <div className="p-4 flex gap-2 bg-white border-t">
        <input
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleEnterKey}
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={createMessage}
          disabled={!messageText.trim()}
          className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatContainer;