/*
  Warnings:

  - A unique constraint covering the columns `[resumeId]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `resumeId` to the `Person` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "resumeId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Person_resumeId_key" ON "Person"("resumeId");

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
