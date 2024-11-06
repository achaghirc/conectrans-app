/*
  Warnings:

  - You are about to drop the column `has_car` on the `Person` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Person" DROP COLUMN "has_car",
ADD COLUMN     "hasCar" BOOLEAN NOT NULL DEFAULT false;
