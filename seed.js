const dotenv = require('dotenv');
dotenv.config(); // โหลด .env ก่อนใช้งาน Prisma

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const newRoom = await prisma.room.create({
    data: {
      number: "102",
      price: 3500,
      type: "Standard",
      status: "available",
      size: "4x5"
    }
  });

  console.log("✅ New Room Created:", newRoom);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
