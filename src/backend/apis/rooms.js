const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// ✅ ดึงห้องทั้งหมด
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { number: 'asc' },
    });

    res.json(rooms); // ส่งข้อมูลห้องโดยไม่ทำการ decode
  } catch (err) {
    console.error('❌ ดึงห้องล้มเหลว:', err);
    res.status(500).json({ error: 'ดึงห้องล้มเหลว' });
  }
});

// ✅ GET ห้องพักตาม ID
router.get('/rooms/:roomId', async (req, res) => {
  const roomId = req.params.roomId; // ดึง roomId จาก URL
  const room = await prisma.room.findUnique({ where: { id: Number(roomId) } });
  if (room) {
    res.json(room);
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
});


// ✅ เพิ่มห้องใหม่
router.post('/rooms', async (req, res) => {
  const { number, price, type, status, size } = req.body;

  try {
    const newRoom = await prisma.room.create({
      data: {
        number,  // ไม่ encode เลขห้อง
        price: Number(price),
        type,    // ไม่ encode ประเภทห้อง
        status,
        size,    // ไม่ encode ขนาดห้อง
      },
    });

    res.status(201).json(newRoom);
  } catch (err) {
    console.error('❌ Error creating room:', err);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// ✅ แก้ไขห้อง
router.put('/rooms/:id', async (req, res) => {
  const { id } = req.params;
  const { number, type, size, price, status } = req.body;

  try {
    const updatedRoom = await prisma.room.update({
      where: { id: Number(id) },
      data: {
        number,  // ไม่ encode เลขห้อง
        type,    // ไม่ encode ประเภทห้อง
        size,    // ไม่ encode ขนาดห้อง
        price: Number(price),
        status,
      },
    });

    res.json(updatedRoom);
  } catch (err) {
    console.error('❌ Error updating room:', err);
    res.status(500).json({ error: 'Failed to update room' });
  }
});

// ✅ ลบห้อง
router.delete('/rooms/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.room.delete({ where: { id: Number(id) } });
    res.json({ message: 'Room deleted' });
  } catch (err) {
    console.error('❌ Error deleting room:', err);
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

module.exports = router;
