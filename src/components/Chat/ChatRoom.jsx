import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../Context/AuthContext";
import { SocketContext } from "../../Context/SocketContext";

const ChatRoom = () => {
  const { targetUserId } = useParams();
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming messages
    const handleReceiveMessage = (data) => {
      // Only add to state if the message is from the person we are chatting with
      if (data.senderId === targetUserId) {
        setMessages((prev) => [...prev, { ...data, isMine: false }]);
      }
    };

    // Listen for socket errors (like "Chat access expired")
    const handleChatError = (errorData) => {
      toast.error(errorData.message);
      navigate("/radar");
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("chat_error", handleChatError);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("chat_error", handleChatError);
    };
  }, [socket, targetUserId, navigate]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    // Optimistically add to UI
    const newMsg = {
      senderId: user.id,
      message: currentMessage,
      timestamp: new Date(),
      isMine: true,
    };
    setMessages((prev) => [...prev, newMsg]);

    // Send via WebSocket
    socket.emit("send_message", {
      senderId: user.id,
      receiverId: targetUserId,
      message: currentMessage,
    });

    setCurrentMessage("");
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col h-screen bg-gray-50 border-x border-gray-200 font-sans">
      {/* Header with Date-NearMe Branding */}
      <div className="px-4 py-3 bg-white/95 backdrop-blur-md border-b border-gray-200 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate("/radar")}
            className="text-gray-600 hover:text-black font-bold text-sm px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition"
          >
            ← Back
          </button>
          <div className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="Date-NearMe"
              className="w-8 h-8 object-contain rounded-lg shadow-sm"
            />
            <div>
              <span className="font-extrabold text-sm text-gray-900 block leading-tight">
                Date-NearMe Chat
              </span>
              <span className="text-[11px] text-green-600 font-semibold flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 inline-block animate-pulse"></span>
                Active Escrow Slot
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-100/60">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
            <img src="/logo.png" alt="Date-NearMe" className="w-16 h-16 opacity-30 mb-2" />
            <p className="text-sm font-medium">Say hello! Break the ice without ghosting.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}
            >
              <span
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm font-medium shadow-sm ${
                  msg.isMine
                    ? "bg-black text-white rounded-br-none"
                    : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                }`}
              >
                {msg.message}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={sendMessage}
        className="p-3 bg-white border-t border-gray-200 flex items-center space-x-2"
      >
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type a thoughtful message..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-black transition"
        />
        <button
          type="submit"
          className="bg-black hover:bg-gray-800 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition active:scale-95 shadow-md"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
