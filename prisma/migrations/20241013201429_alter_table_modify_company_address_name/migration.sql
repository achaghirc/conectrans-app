/*
  Warnings:

  - You are about to drop the column `address` on the `Company` table. All the data in the column will be lost.
  - Added the required column `landlinePhone` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "address",
ADD COLUMN     "landlinePhone" TEXT NOT NULL;
