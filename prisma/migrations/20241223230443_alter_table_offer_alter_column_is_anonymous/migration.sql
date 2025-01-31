/*
  Warnings:

  - You are about to drop the column `isAnonimous` on the `Offer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "isAnonimous",
ADD COLUMN     "isAnonymous" BOOLEAN NOT NULL DEFAULT false;
