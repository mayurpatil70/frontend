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
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div style={{ padding: "15px", background: "#333", color: "#fff" }}>
        <button
          onClick={() => navigate("/radar")}
          style={{ marginRight: "15px" }}
        >
          Back
        </button>
        Chatting...
      </div>

      <div
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
          background: "#f4f4f4",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.isMine ? "right" : "left",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                background: msg.isMine ? "#007bff" : "#ddd",
                color: msg.isMine ? "#fff" : "#000",
                padding: "10px",
                borderRadius: "10px",
                display: "inline-block",
                maxWidth: "70%",
              }}
            >
              {msg.message}
            </span>
          </div>
        ))}
      </div>

      <form
        onSubmit={sendMessage}
        style={{ padding: "15px", display: "flex", background: "#fff" }}
      >
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            background: "#28a745",
            color: "#fff",
            border: "none",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
