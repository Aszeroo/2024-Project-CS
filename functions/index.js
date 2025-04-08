const functions = require('firebase-functions');
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();  // โหลดตัวแปรจาก .env ไฟล์

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:071244o@localhost:5433/dormdb',
    },
  },
});
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'default-secret-key';

const authRoutes = require('./apis/auth');
const bookingRoutes = require('./apis/booking');
const roomRoutes = require('./apis/rooms');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173' }, // หรือ domain ของ frontend ของคุณ
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Inject socket.io เข้าไปใน request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api', roomRoutes);
app.use('/api', bookingRoutes);
app.use('/api', authRoutes);

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'user' && password === 'password') {
    res.status(200).send({ message: 'Login success' });
  } else {
    res.status(400).send({ message: 'Invalid credentials' });
  }
});

// Firebase Function เพื่อทำให้ Express ทำงานใน Firebase Functions
exports.app = functions.https.onRequest(app);

// หากต้องการให้ server ทำงานอยู่บน HTTP server ปกติ (ไม่แนะนำในการ deploy Firebase)
server.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server is running on port ${process.env.PORT || 5000}`);
});
