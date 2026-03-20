-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NORMAL', 'WARNING', 'CRITICAL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hardware" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "category" TEXT,
    "status" "Status" NOT NULL DEFAULT 'NORMAL',
    "userId" TEXT,
    "lastCheckDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hardware_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Hardware_serialNumber_key" ON "Hardware"("serialNumber");

-- CreateIndex
CREATE INDEX "Hardware_status_idx" ON "Hardware"("status");

-- CreateIndex
CREATE INDEX "Hardware_userId_idx" ON "Hardware"("userId");

-- AddForeignKey
ALTER TABLE "Hardware" ADD CONSTRAINT "Hardware_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
