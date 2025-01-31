/*
  Warnings:

  - A unique constraint covering the columns `[profileImageId]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profileImageId` to the `Person` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "profileImageId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Person_profileImageId_key" ON "Person"("profileImageId");

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_profileImageId_fkey" FOREIGN KEY ("profileImageId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
