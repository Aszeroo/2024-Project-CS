const jwt = require('jsonwebtoken');

// Middleware เพื่อเช็คการยืนยันตัวตน
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // ดึง token

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.userId = decoded.id;  // เพิ่ม userId ใน request
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};


module.exports = authenticateToken;
