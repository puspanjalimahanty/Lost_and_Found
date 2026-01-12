const LostItem = require('../models/LostItem');

// ✅ POST: Create a new lost item (Login required)
exports.createLostItem = async (req, res) => {
  try {


    const { itemName, description, dateLost, location } = req.body;
        console.log("📦 Saving new item:", {
  itemName,
  description,
  dateLost,
  location,
  imagePath: req.file ? req.file.path : null,
  user: req.userId
});

    const newItem = new LostItem({
      itemName,
      description,
      dateLost,
      location,
      imagePath: req.file ? req.file.path : null,
      user: req.userId // 👈 comes from authenticateJWT middleware
    });

    const savedItem = await newItem.save();

    res.status(201).json({
      message: 'Lost item submitted successfully!',
      item: savedItem
    });
  } catch (err) {
   console.error("❌ Error saving item:", err.message);

    res.status(500).json({ message: 'Server error while saving lost item' });
  }
};

// ✅ GET: Fetch all lost items (with optional filters)
exports.getAllLostItems = async (req, res) => {
  try {
    const { itemName, location, dateLost } = req.query;
    const filter = {};

    if (itemName) {
      filter.itemName = { $regex: itemName, $options: 'i' };
    }
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    if (dateLost) {
      filter.dateLost = new Date(dateLost);
    }

    const items = await LostItem.find(filter)
      .populate("user", "name email") // optional: show who posted
      .sort({ createdAt: -1 });

    res.status(200).json(items);
  } catch (err) {
    console.error("❌ Error fetching lost items:", err);
    res.status(500).json({ message: 'Error retrieving lost items' });
  }
};

// ✅ GET: Fetch a single lost item by ID (with owner info)
exports.getLostItemById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Searching for lost item with ID:", id);

    // Fetch item and populate owner details
    const item = await LostItem.findById(id).populate("user", "name email");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      itemName: item.itemName,
      description: item.description,
      location: item.location,
      dateLost: item.dateLost,
      imagePath: item.imagePath,
      owner: {
        id: item.user?._id,
        name: item.user?.name,
        email: item.user?.email
      }
    });
  } catch (error) {
    console.error("❌ Error in getLostItemById:", error);
    res.status(500).json({ message: "Server error" });
  }
};




