// 📁 middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🧾 Auth Header:", authHeader); 


  

  // ✅ Check if Authorization header is present and starts with Bearer
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    console.log("🧾 Extracted Token:", token); 
    console.log("🔐 Token in frontend:", token);


    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.userId = decoded.id; // Save user ID to request for further use
      next(); // Proceed to the next middleware/controller
    } catch (err) {
      console.error("❌ Invalid token:", err.message);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } else {
    return res.status(401).json({ message: 'Authorization token missing' });
  }
};

module.exports = verifyToken;
