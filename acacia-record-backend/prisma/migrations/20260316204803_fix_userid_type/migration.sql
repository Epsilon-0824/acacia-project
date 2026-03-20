/*
  Warnings:

  - You are about to drop the `Hardware` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Hardware" DROP CONSTRAINT "Hardware_userId_fkey";

-- DropTable
DROP TABLE "Hardware";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hardwares" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "category" TEXT,
    "status" "Status" NOT NULL DEFAULT 'NORMAL',
    "userId" INTEGER,
    "lastCheckDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hardwares_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "hardwares_serialNumber_key" ON "hardwares"("serialNumber");

-- CreateIndex
CREATE INDEX "hardwares_status_idx" ON "hardwares"("status");

-- CreateIndex
CREATE INDEX "hardwares_userId_idx" ON "hardwares"("userId");

-- AddForeignKey
ALTER TABLE "hardwares" ADD CONSTRAINT "hardwares_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
