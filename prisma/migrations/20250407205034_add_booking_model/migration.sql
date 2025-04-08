/*
  Warnings:

  - You are about to drop the column `userId` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "userId",
ALTER COLUMN "roomNumber" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_roomNumber_fkey" FOREIGN KEY ("roomNumber") REFERENCES "Room"("number") ON DELETE RESTRICT ON UPDATE CASCADE;
