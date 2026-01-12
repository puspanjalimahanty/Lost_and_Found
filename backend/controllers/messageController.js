const Message = require('../models/Message');
const User = require('../models/User');
const LostItem = require('../models/LostItem');

// 📩 POST: Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { itemId, text } = req.body;

    // Find the lost item
    const lostItem = await LostItem.findById(itemId).populate('user');
    if (!lostItem) return res.status(404).json({ error: "Item not found" });

    const recipientId = lostItem.user._id;

    const message = new Message({
      sender: req.userId,
      recipient: recipientId,
      text
    });

    const saved = await message.save();

    // Emit via socket.io if connected
    if (req.io) {
      req.io.to(recipientId.toString()).emit("newMessage", saved);
    }

    res.status(201).json({ message: 'Message sent', data: saved });
  } catch (err) {
    console.error("❌ Error sending message:", err.message);
    res.status(500).json({ error: 'Server error while sending message' });
  }
};

// 💬 GET: Get chat messages between two users
exports.getMessages = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Find the owner of the item
    const lostItem = await LostItem.findById(itemId).populate('user');
    if (!lostItem) return res.status(404).json({ error: "Item not found" });

    const recipientId = lostItem.user._id;

    const messages = await Message.find({
      $or: [
        { sender: req.userId, recipient: recipientId },
        { sender: recipientId, recipient: req.userId }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'name')
    .populate('recipient', 'name');

    const formattedMessages = messages.map((msg) => ({
      _id: msg._id,
      text: msg.text,
      sender: msg.sender._id.toString(),
      senderName: msg.sender.name,
      recipientName: msg.recipient.name,
      timestamp: msg.createdAt?.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }) || 'Time Unknown',
    }));

    res.status(200).json(formattedMessages);
  } catch (err) {
    console.error("❌ Error fetching messages:", err.message);
    res.status(500).json({ error: 'Server error while retrieving messages' });
  }
};

