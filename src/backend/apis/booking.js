const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const authenticateToken = require('../middleware/authenticateToken');

// ✅ Create booking (no encode/decode)
router.post('/bookings', async (req, res) => {
  try {
    const { name, phone, date, roomNumber, userId } = req.body;

    // ตรวจสอบข้อมูล userId
    if (!userId) {
      return res.status(400).json({ error: 'โปรดระบุ userId' });
    }

    // ตรวจสอบห้องในระบบ
    const room = await prisma.room.findUnique({ where: { number: roomNumber } });
    if (!room) return res.status(404).json({ error: 'ไม่พบห้องนี้ในระบบ' });

    const bookingDate = new Date(date);

    // บันทึกข้อมูลการจอง
    const booking = await prisma.booking.create({
      data: {
        name: name,  // เก็บข้อมูลที่ไม่เข้ารหัส
        phone: phone,
        date: bookingDate,
        roomNumber: roomNumber,
        userId: userId,
      },
    });

    // อัพเดตสถานะห้องให้เป็น 'occupied'
    await prisma.room.update({
      where: { number: roomNumber },
      data: { status: 'occupied' },
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error('❌ Error:', err);  // เพิ่มบันทึก error
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Get all bookings (no encode/decode)
router.get('/bookings', async (req, res) => {
  try {
    console.log("Fetching bookings...");
    const bookings = await prisma.booking.findMany({ orderBy: { date: 'desc' } });
    console.log("Bookings fetched:", bookings);

    res.json(bookings);  // ส่งข้อมูลปกติที่ไม่ได้เข้ารหัส
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// ✅ Delete booking และอัปเดตสถานะห้องให้กลับเป็น 'available'
router.delete('/bookings/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    // ค้นหาการจองที่ต้องการลบ
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return res.status(404).json({ error: 'ไม่พบข้อมูลการจอง' });

    // ลบการจอง
    await prisma.booking.delete({ where: { id } });

    // อัปเดตสถานะห้องให้กลับเป็น 'available'
    await prisma.room.update({
      where: { number: booking.roomNumber },
      data: { status: 'available' },
    });

    res.status(200).json({ message: 'ลบการจองและอัปเดตสถานะห้องสำเร็จ' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete booking and update room status' });
  }
});

// ✅ Get booking stats (ยอดการจองทั้งหมด, ห้องที่ไม่ว่าง, ห้องที่ว่าง)
router.get('/bookings/stats', async (req, res) => {
  try {
    const totalBookings = await prisma.booking.count();
    const occupiedRooms = await prisma.room.count({
      where: { status: 'occupied' }
    });
    const availableRooms = await prisma.room.count({
      where: { status: 'available' }
    });

    res.json({ totalBookings, occupiedRooms, availableRooms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ✅ Get daily stats (การจองต่อวัน)
router.get('/bookings/statistics/daily', async (req, res) => {
  try {
    const dailyStats = await prisma.booking.groupBy({
      by: ['date'],
      _count: { id: true },
      orderBy: { date: 'asc' },
    });
    res.json(dailyStats.map((stat) => ({
      day: stat.date.toISOString().split('T')[0],
      count: stat._count.id,
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch daily statistics' });
  }
});

// ✅ Get monthly stats (การจองต่อเดือน)
router.get('/bookings/statistics/monthly', async (req, res) => {
  try {
    const monthlyStats = await prisma.booking.groupBy({
      by: ['date'],
      _count: { id: true },
      orderBy: { date: 'asc' },
    });

    const formattedMonthlyStats = monthlyStats.map((stat) => ({
      month: stat.date.toISOString().split('T')[0].slice(0, 7),
      count: stat._count.id,
    }));

    res.json(formattedMonthlyStats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch monthly statistics' });
  }
});

// Get user's bookings (if logged in)
router.get('/bookings/my', authenticateToken, async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'กรุณาล็อกอินก่อน' });
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: userId },
      orderBy: { date: 'desc' },
    });
    res.json(bookings);
  } catch (err) {
    console.error('❌ ไม่สามารถดึงข้อมูลการจองของผู้ใช้ได้:', err);
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลการจอง' });
  }
});

// ยกเลิกการจอง
router.delete('/bookings/:id', async (req, res) => {
  const id = Number(req.params.id);
  const userId = req.userId;  // userId ที่ต้องได้รับจากการยืนยันตัวตน

  if (!userId) {
    return res.status(401).json({ error: 'กรุณาล็อกอินก่อน' });
  }

  try {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking || booking.userId !== userId) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลการจองหรือการจองไม่ใช่ของคุณ' });
    }

    // ลบการจอง
    await prisma.booking.delete({ where: { id } });

    // อัปเดตสถานะห้องให้กลับเป็น 'available'
    await prisma.room.update({
      where: { number: booking.roomNumber },
      data: { status: 'available' },
    });

    res.status(200).json({ message: 'ยกเลิกการจองสำเร็จ' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการยกเลิกการจอง' });
  }
});

module.exports = router;
