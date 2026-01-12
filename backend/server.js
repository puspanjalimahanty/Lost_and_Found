// 📁 backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http"); // ✅ Added
const { Server } = require("socket.io"); // ✅ Added

const authRoutes = require("./routes/authRoutes");
const lostItemRoutes = require("./routes/lostItemRoutes");
const foundItemRoutes = require("./routes/foundItemRoutes");
const messageRoutes = require("./routes/messageRoutes"); // ✅

dotenv.config();

const app = express();
const server = http.createServer(app); // ✅ Use HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Change to your frontend URL in production
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads/found-items", express.static("uploads/found-items"));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api", authRoutes);
app.use("/api/lost-items", lostItemRoutes);
app.use("/api/found-items", foundItemRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Socket.IO logic
io.on("connection", (socket) => {
  console.log("🟢 New user connected:", socket.id);

  // Join personal room
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Receive message & send to recipient
  socket.on("sendMessage", ({ recipientId, message }) => {
    io.to(recipientId).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
