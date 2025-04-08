// สถิติการจองรายวัน
router.get('/bookings/statistics/daily', async (req, res) => {
    try {
      const result = await prisma.$queryRaw`
        SELECT DATE(date) AS day, COUNT(*) AS count
        FROM Booking
        GROUP BY day
        ORDER BY day DESC
        LIMIT 30;
      `;
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถิติรายวัน' });
    }
  });
  
  // สถิติการจองรายเดือน
  router.get('/bookings/statistics/monthly', async (req, res) => {
    try {
      const result = await prisma.$queryRaw`
        SELECT TO_CHAR(date, 'YYYY-MM') AS month, COUNT(*) AS count
        FROM Booking
        GROUP BY month
        ORDER BY month DESC
        LIMIT 12;
      `;
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถิติรายเดือน' });
    }
  });
  