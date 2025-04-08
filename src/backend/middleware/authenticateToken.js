const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // ดึง token จาก header

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);  // ตรวจสอบ token ด้วย secret key
    req.userId = decoded.id;  // นำ userId จาก token มาใส่ใน req
    next();  // ถ้ามีการยืนยันตัวตนสำเร็จ
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authenticateToken;
