const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'default-secret-key';



// ✅ สมัครสมาชิก
router.post('/register', async (req, res) => {
  const { username, password, role = 'USER' } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });

    res.json({ message: 'Register success', user: { id: newUser.id, role: newUser.role } });
  } catch (err) {
    console.error('❌ Register error:', err);
    res.status(500).json({ error: 'Register failed' });
  }
});

// ✅ เข้าสู่ระบบ
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }


    // สร้าง JWT token หลังจาก login สำเร็จ
const token = jwt.sign(
  { id: user.id, username: user.username, role: user.role },
  JWT_SECRET_KEY,  // ใช้จาก .env
  { expiresIn: '1h' }
);

    res.json({
      message: 'Login success',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        token: token, // ส่ง token ไปพร้อมกับข้อมูลผู้ใช้
      },
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
