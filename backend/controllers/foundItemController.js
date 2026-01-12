const FoundItem = require('../models/FoundItem');

// ✅ POST: Report a found item (Only logged-in users)
exports.createFoundItem = async (req, res) => {
  try {
    const { itemName, description, location, dateFound } = req.body;
    const imagePath = req.file ? req.file.path : null;

    const foundItem = new FoundItem({
      itemName,
      description,
      location,
      dateFound,
      imagePath,
     // 👈 This comes from auth middleware
    });

    await foundItem.save();

    res.status(201).json({
      message: "Found item reported successfully!",
      foundItem
    });
  } catch (err) {
    console.error("❌ Error saving found item:", err);
    res.status(500).json({ error: "Server error while reporting found item" });
  }
};

// ✅ GET: Retrieve all found items (filters optional)
// ✅ GET all found items
// 📁 backend/controllers/foundItemController.js


// ✅ Get all found items
exports.getAllFoundItems = async (req, res) => {
  try {
    const items = await FoundItem.find();  // fetch all found items
    res.status(200).json(items);
  } catch (error) {
    console.error("❌ Error fetching found items:", error);
    res.status(500).json({ message: "Server error" });
  }
};
