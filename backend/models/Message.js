const mongoose = require('mongoose'); // ✅ Add this line

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true }
}, {
  timestamps: true // ✅ Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Message', messageSchema);
