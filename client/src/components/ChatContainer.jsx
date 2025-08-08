import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, fetchMessages, sendMessageToServer } from "../redux/slices/chatSlice.js";
import ChatHeader from "./ChatHeader.jsx";
import ChatTopbar from "./ChatTopbar.jsx";
import MessageBox from "./MessageBox.jsx";
import { socket } from "../socket.js";
import { toast } from "react-hot-toast";

function ChatContainer() {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const [messageText, setMessageText] = useState("");

  const { selectedUser, messages, loading, sendingMessage, error } = useSelector(state => state.chat);
  const { currentUser } = useSelector(state => state.auth);

  const createMessage = useCallback(async () => {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage || !selectedUser || sendingMessage) return;

    const messageData = {
      receiverId: selectedUser._id,
      text: trimmedMessage,
    };

    try {
      await dispatch(sendMessageToServer(messageData)).unwrap();
      setMessageText("");
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  }, [messageText, selectedUser, sendingMessage, dispatch]);

  const handleEnterKey = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      createMessage();
    }
  }, [createMessage]);

  const scrollToLatestMessage = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const isMessageFromCurrentUser = useCallback((msg) => {
    if (!msg?.sender || !currentUser?._id) return false;
    const senderId = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
    return senderId === currentUser._id;
  }, [currentUser?._id]);

 
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      if (!data || !currentUser?._id) return;
      
      const senderId = typeof data.sender === "object" ? data.sender._id : data.sender;
      const receiverId = typeof data.receiver === "object" ? data.receiver._id : data.receiver;

      
      if (receiverId === currentUser._id && senderId !== selectedUser?._id) {
        toast.success("Got a new message");
      }

      
      if ((senderId === currentUser._id && receiverId === selectedUser?._id) ||
          (senderId === selectedUser?._id && receiverId === currentUser._id)) {
        dispatch(addMessage(data));
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [dispatch, currentUser?._id, selectedUser?._id]);

  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(fetchMessages(selectedUser._id));
    }
  }, [selectedUser?._id, dispatch]);

  useEffect(() => {
    scrollToLatestMessage();
  }, [messages, scrollToLatestMessage]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-xl bg-gray-50 m-4 rounded-2xl">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <p>Select a user to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shadow-2xl hover:shadow-yellow-500 transition flex-1 flex flex-col m-4 p-4 rounded-2xl bg-gray-50 h-screen">
      <ChatHeader onToggleTheme={() => toast.success("Theme toggle coming soon!")} />
      <ChatTopbar selectedUser={selectedUser} />

      <main className="flex-1 p-6 flex flex-col bg-white rounded-b-xl shadow-inner overflow-y-auto space-y-4">
        {loading ? (
          <div className="flex items-center justify-center text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mr-2"></div>
            Loading messages...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center text-red-500 bg-red-50 rounded-lg p-4">
            <span>Error: {error}</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">👋</div>
              <p>No messages yet. Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <MessageBox
              key={msg?._id || msg?.id || `msg-${idx}`}
              message={msg}
              isSender={isMessageFromCurrentUser(msg)}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </main>

      <div className="p-4 flex gap-2 bg-white border-t rounded-b-xl">
        <input
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleEnterKey}
          type="text"
          placeholder="Type a message..."
          disabled={sendingMessage}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
        />
        <button
          onClick={createMessage}
          disabled={!messageText.trim() || sendingMessage}
          className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
        >
          {sendingMessage ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default React.memo(ChatContainer);