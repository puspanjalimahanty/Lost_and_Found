// 📁 routes/foundItemRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require("fs");
const verifyToken = require('../middleware/authMiddleware'); // ✅ your JWT middleware
const {
  createFoundItem,
  getAllFoundItems,
} = require('../controllers/foundItemController');
// ✅ ENSURE UPLOAD DIRECTORY EXISTS (RENDER FIX)
const uploadDir = "uploads/found-items";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploadDir'); // Save under /uploads/found-items
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `found-${uniqueSuffix}${ext}`);
  }
});
  
const upload = multer({ storage });

// ✅ Protected route to create a found item (with image)
router.post('/', verifyToken, upload.single('image'), createFoundItem);

// ✅ Public route to get found items
router.get("/", getAllFoundItems);


module.exports = router;
