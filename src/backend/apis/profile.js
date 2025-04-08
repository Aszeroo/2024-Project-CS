const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.get('/profile/:id', async (req, res) => {
  const userId = Number(req.params.id);
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, role: true }
    });
    if (!user) return res.status(404).json({ error: 'ไม่พบผู้ใช้' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
  }
});

module.exports = router;
