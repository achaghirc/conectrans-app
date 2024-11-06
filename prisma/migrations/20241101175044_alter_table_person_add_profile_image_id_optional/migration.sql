-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_resumeId_fkey";

-- AlterTable
ALTER TABLE "Person" ALTER COLUMN "resumeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
