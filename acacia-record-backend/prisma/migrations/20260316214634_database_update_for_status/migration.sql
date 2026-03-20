/*
  Warnings:

  - You are about to drop the column `lastCheckDate` on the `hardwares` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `hardwares` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `hardwares` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `hardwares` table. All the data in the column will be lost.
  - Changed the type of `permission` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('ADMIN', 'IT');

-- DropForeignKey
ALTER TABLE "hardwares" DROP CONSTRAINT "hardwares_userId_fkey";

-- DropIndex
DROP INDEX "hardwares_status_idx";

-- DropIndex
DROP INDEX "hardwares_userId_idx";

-- AlterTable
ALTER TABLE "hardwares" DROP COLUMN "lastCheckDate",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "permission",
ADD COLUMN     "permission" "Permission" NOT NULL;

-- CreateTable
CREATE TABLE "hardwareChecks" (
    "id" SERIAL NOT NULL,
    "checkpointName" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'NORMAL',
    "lastUpdatedBy" INTEGER NOT NULL,
    "hardwareId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hardwareChecks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "hardwareChecks" ADD CONSTRAINT "hardwareChecks_lastUpdatedBy_fkey" FOREIGN KEY ("lastUpdatedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hardwareChecks" ADD CONSTRAINT "hardwareChecks_hardwareId_fkey" FOREIGN KEY ("hardwareId") REFERENCES "hardwares"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
