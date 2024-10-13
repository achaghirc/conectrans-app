/*
  Warnings:

  - You are about to drop the column `companyPosition` on the `Person` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[contactPersonId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contactPersonId` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "contactPersonId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "companyPosition";

-- CreateTable
CREATE TABLE "ContactPerson" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "document" TEXT,
    "companyPosition" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactPerson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_contactPersonId_key" ON "Company"("contactPersonId");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_contactPersonId_fkey" FOREIGN KEY ("contactPersonId") REFERENCES "ContactPerson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
