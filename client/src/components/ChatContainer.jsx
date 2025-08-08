import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, fetchMessages, sendMessageToServer } from "../redux/slices/chatSlice.js";
import ChatHeader from "./ChatHeader.jsx";
import ChatTopbar from "./ChatTopbar.jsx";
import MessageBox from "./MessageBox.jsx";
import { connectSocket, disconnectSocket, socket } from "../socket.js";
import { toast } from "react-hot-toast";

function ChatContainer() {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const [messageText, setMessageText] = useState("");
  const [sendMessage, setSending] = useState(false)

  const { selectedUser, messages, loading, sendingMessage, error } = useSelector(state => state.chat);
  const { currentUser } = useSelector(state => state.auth);

  const createMessage = async () => {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage || !selectedUser || sendingMessage) return;

    const messageData = {
      receiverId: selectedUser._id,
      text: trimmedMessage,
    };

    try {
      await dispatch(sendMessageToServer(messageData)).unwrap();
      setMessageText("");
      setSending(true)
    } catch (error) {
      console.error('Failed to send message:', error);
    }
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


  // hard to
  const isMessageFromCurrentUser = (msg) => {
    if (!msg?.sender || !currentUser?._id) return false;
    return msg.sender._id === currentUser._id || msg.sender === currentUser._id;
  };


  useEffect(() => {
    if (!socket.connected && currentUser?._id) {
      connectSocket(currentUser._id);
    }
    return () => {
      disconnectSocket();
    };
  }, [currentUser?._id]);


  // socket to subscribing message
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log(data);

      // doest work for now
      if (data.receiver === currentUser?._id && data.sender !== selectedUser?._id) {
        toast.success("got a message")
        // toast.custom((t) => (
        //   <div className="bg-white shadow-md rounded-md p-4 text-black">
        //     <p>You have a new message from:</p>
        //     <strong>{data.sender?.username || "Unknown User"}</strong>
        //     <button onClick={() => toast.dismiss(t.id)}>Dismiss</button>
        //   </div>
        // ));
        // toast.success("have a message")
      }
      if (data.sender === currentUser?._id || data.sender === selectedUser?._id) {
        dispatch(addMessage(data));
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    // console.log("socket called");

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [dispatch]);



  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(fetchMessages(selectedUser._id));
    }
  }, [selectedUser?._id, dispatch]);

  useEffect(() => {
    scrollToLatestMessage();
    // console.log(messages); //array of obj and can be mapped 
  }, [messages]);




  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-xl">
        Select a user to start chatting 💬
      </div>
    );
  }

  return (<>
      <ChatHeader onToggleTheme={() => alert("Theme toggled")} />
    <div className="shadow-2xl hover:shadow-yellow-500 transition flex-1 flex flex-col m-4 p-4 rounded-2xl bg-gray-50 h-screen">
      <ChatTopbar selectedUser={selectedUser} />

      <main className="flex-1 p-6 flex flex-col bg-white rounded-b-xl shadow-inner overflow-y-auto space-y-4">
        {loading ? (
          <div className="flex items-center justify-center text-gray-500">
            Loading messages...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center text-red-500">
            Error: {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center text-gray-400">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, idx) => (
            <MessageBox
              key={msg?._id || msg?.id || idx}
              message={msg}
              isSender={isMessageFromCurrentUser(msg)}
              onDelete={() => { }}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </main>

      <div className="p-4 flex gap-2 bg-white border-t">
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
          className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sendingMessage ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
    </>
  );
}

export default ChatContainer;