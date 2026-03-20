-- DropForeignKey
ALTER TABLE "hardwareChecks" DROP CONSTRAINT "hardwareChecks_hardwareId_fkey";

-- AddForeignKey
ALTER TABLE "hardwareChecks" ADD CONSTRAINT "hardwareChecks_hardwareId_fkey" FOREIGN KEY ("hardwareId") REFERENCES "hardwares"("id") ON DELETE CASCADE ON UPDATE CASCADE;
