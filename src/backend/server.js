const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

require('dotenv').config();  // เพื่อโหลดตัวแปรจาก .env ไฟล์
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:071244o@localhost:5433/dormdb',
    },
  },
});
// JWT secret key สำหรับการสร้าง Token
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'default-secret-key';

const authRoutes = require('./apis/auth');
const bookingRoutes = require('./apis/booking');
const roomRoutes = require('./apis/rooms');


const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173' }
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// ✅ inject io เข้า req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ✅ Routes
app.use('/api', roomRoutes);
app.use('/api', bookingRoutes);
app.use('/api', authRoutes);

app.post('/api/login', (req, res) => {
  // ตรงนี้ใส่โค้ดการตรวจสอบข้อมูลของผู้ใช้ เช่น เช็คฐานข้อมูลหรือ token
  const { username, password } = req.body;

  if (username === 'user' && password === 'password') {
    res.status(200).send({ message: 'Login success' });
  } else {
    res.status(400).send({ message: 'Invalid credentials' });
  }
});



require('dotenv').config();  // โหลดค่าใน .env


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});

