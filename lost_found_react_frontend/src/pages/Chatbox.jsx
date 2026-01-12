import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // ✅ socket connection

const Chatbox = () => {
  const { itemId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [recipientId, setRecipientId] = useState(""); // ✅ fixed missing state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    setUserId(decoded.id);
    setUserName(decoded.name);

    // ✅ Add user to socket
    socket.emit("addUser", decoded.id);

    // ✅ Listen for incoming messages
    socket.on("getMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("getMessage");
    };
  }, []);

  const handleSend = () => {
    if (!text.trim() || !recipientId) return;

    const msgData = {
      senderId: userId,
      recipientId,
      text,
      senderName: userName,
      timestamp: new Date(),
    };

    // ✅ Emit message via socket
    socket.emit("sendMessage", msgData);

    // ✅ Show instantly in chat
    setMessages((prev) => [...prev, msgData]);
    setText("");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Chat with Owner</h2>

      <input
        type="text"
        value={recipientId}
        onChange={(e) => setRecipientId(e.target.value)}
        placeholder="Enter recipient ID"
        style={{ marginBottom: "10px", padding: "8px", width: "100%" }}
      />

      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {messages.length > 0 ? (
          messages.map((msg, i) => (
            <div
              key={i}
              style={{
                textAlign: msg.senderId === userId ? "right" : "left",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  background:
                    msg.senderId === userId ? "#007bff" : "#ccc",
                  color: "#fff",
                  padding: "6px 10px",
                  borderRadius: "10px",
                  display: "inline-block",
                }}
              >
                {msg.text}
              </span>
              <br />
              <small>{msg.senderName}</small>
            </div>
          ))
        ) : (
          <p>No messages yet</p>
        )}
      </div>

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        style={{ padding: "10px", width: "80%" }}
      />
      <button
        onClick={handleSend}
        style={{
          padding: "10px 15px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          marginLeft: "10px",
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </div>
  );
};

export default Chatbox;
