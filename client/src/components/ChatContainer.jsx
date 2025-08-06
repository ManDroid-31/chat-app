import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatTopbar from "./ChatTopBar.jsx";
import MessageBox from "./MessageBox.jsx";

const mockMessages = [
    { id: 1, senderId: "me", text: "Hey, this is the file with all the passwords." },
    { id: 2, senderId: "other", text: "Thanks! Will check it now." },
    { id: 3, senderId: "me", text: "Let me know if you have any issues." }
];

const selectedUserMock = {
    name: "Tanmay",
    avatar: "https://i.pravatar.cc/40?img=3",
    isOnline: true
};

function ChatContainer() {
    const [messages, setMessages] = useState(mockMessages);
    const [input, setInput] = useState("");
    const bottomRef = useRef(null);

    const handleSend = () => {
        if (!input.trim()) return;
        const newMsg = {
            id: Date.now(),
            senderId: "me",
            text: input.trim()
        };
        setMessages([...messages, newMsg]);
        setInput("");
    };

    useEffect(() => {
        if(bottomRef.current){
            bottomRef.current.scrollIntoView({behavior: 'smooth'})
        }
    },[messages])

    const handleDelete = (id) => {
        setMessages(messages.filter((m) => m.id !== id));
    };

    return (
        <div className="shadow-2xl hover:shadow-yellow-500 transition flex-1 flex flex-col m-4 p-4 rounded-2xl bg-gray-50 h-screen">
            <ChatHeader onToggleTheme={() => alert("Theme toggled")} />
            <ChatTopbar selectedUser={selectedUserMock} />

            <main className="flex-1 p-6 flex flex-col bg-white rounded-b-xl shadow-inner overflow-y-auto space-y-4">
                {messages.map((msg) => (
                    <MessageBox
                        key={msg.id}
                        message={msg}
                        isSender={msg.senderId === "me"}
                        onDelete={handleDelete}
                    />
                ))}
                <div ref={bottomRef}></div>
            </main>

            {/* Input */}
            <div className="p-4 flex gap-2 bg-white border-t">
                <input
                    value={input}
                    onChange={
                        (e) => {
                            setInput(e.target.value);
                        }
                    }
                    onKeyDown={
                        (e) => {
                            if(e.key == "Enter") handleSend();
                        }
                    }
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                    onClick={handleSend}
                    className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatContainer;
