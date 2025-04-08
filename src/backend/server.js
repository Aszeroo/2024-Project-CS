const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authRoutes = require('./apis/auth');
const bookingRoutes = require('./apis/booking');
const roomRoutes = require('./apis/rooms');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173' }
});

app.use(cors());
app.use(express.json());

// ✅ inject io เข้า req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ✅ Routes
app.use('/api', roomRoutes);
app.use('/api', bookingRoutes);
app.use('/api', authRoutes);

require('dotenv').config();  // โหลดค่าใน .env


const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server + WebSocket running at http://localhost:${PORT}`);
});
