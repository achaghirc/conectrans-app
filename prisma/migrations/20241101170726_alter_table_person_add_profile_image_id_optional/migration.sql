-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_profileImageId_fkey";

-- AlterTable
ALTER TABLE "Person" ALTER COLUMN "profileImageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_profileImageId_fkey" FOREIGN KEY ("profileImageId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
