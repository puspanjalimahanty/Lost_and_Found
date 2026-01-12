const express = require("express");
const fs = require("fs");
const router = express.Router();
const {
  createLostItem,
  getAllLostItems,
  getLostItemById
} = require("../controllers/lostItemController");

const multer = require("multer");
const path = require("path");
const verifyToken = require("../middleware/authMiddleware");

const uploadDir = "uploads/lost-items";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploadDir");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Routes
router.post("/", verifyToken, upload.single("image"), createLostItem);
router.get("/", getAllLostItems); // 🔥 This enables your frontend to fetch data
router.get("/:id", getLostItemById);
// GET /api/lost-items?search=wallet
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;

    const query = search
      ? {
          itemName: { $regex: search, $options: 'i' },
        }
      : {};

    const items = await LostItem.find(query);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});



module.exports = router;
