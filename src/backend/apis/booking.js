const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const authenticateToken = require('../middleware/authenticateToken');
const base64 = require('base-64');

// ฟังก์ชันเพื่อ decode ข้อมูลจาก Base64
function decodeBase64(encodedData) {
  return {
    name: base64.decode(encodedData.name),
    phone: base64.decode(encodedData.phone),
    date: base64.decode(encodedData.date),
    roomNumber: base64.decode(encodedData.roomNumber),
  };
}

// ✅ Create booking (encode/decode)

router.post('/bookings', async (req, res) => {
  try {
    console.log(req.body); // ตรวจสอบข้อมูลที่ส่งมาจาก frontend
    const { name, phone, date, roomNumber, userId } = req.body;

    // ถอดรหัสข้อมูลที่ส่งมาจาก frontend
    const decodedName = base64.decode(name);
    const decodedPhone = base64.decode(phone);
    const decodedDate = base64.decode(date);
    const decodedRoomNumber = base64.decode(roomNumber);

    // ตรวจสอบข้อมูล userId
    if (!userId) {
      return res.status(400).json({ error: 'โปรดระบุ userId' });
    }

    const room = await prisma.room.findUnique({ where: { number: decodedRoomNumber } });
    if (!room) return res.status(404).json({ error: 'ไม่พบห้องนี้ในระบบ' });

    const bookingDate = new Date(decodedDate);

    const booking = await prisma.booking.create({
      data: {
        name: decodedName,
        phone: decodedPhone,
        date: bookingDate,
        roomNumber: decodedRoomNumber,
        userId: userId,
      },
    });

    await prisma.room.update({
      where: { number: decodedRoomNumber },
      data: { status: 'occupied' },
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error('❌ Error:', err); // เพิ่มบันทึก error
    res.status(500).json({ error: 'Internal server error' });
  }
});







// ✅ Get all bookings (no decode)
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({ orderBy: { date: 'desc' } });
    
    // decode ข้อมูลก่อนส่งไปยัง frontend
    const decodedBookings = bookings.map(booking => ({
      ...booking,
      name: base64.decode(booking.name),
      phone: base64.decode(booking.phone),
      date: base64.decode(booking.date),
      roomNumber: base64.decode(booking.roomNumber),
    }));

    res.json(decodedBookings);  // ส่งข้อมูล decoded กลับไป
  } catch (err) {
    console.error(err);
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
    // สรุปยอดการจองทั้งหมด
    const totalBookings = await prisma.booking.count();
    
    // สรุปห้องที่ไม่ว่าง
    const occupiedRooms = await prisma.room.count({
      where: { status: 'occupied' }
    });

    // สรุปห้องที่ว่าง
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

// เพิ่มเส้นทางนี้ใน backend ของคุณ
// เพิ่มเส้นทางนี้ใน backend ของคุณ
// ใช้ middleware authenticateToken
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
