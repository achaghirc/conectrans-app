/*
  Warnings:

  - Added the required column `landlinePhone` to the `Person` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "landlinePhone" TEXT NOT NULL;
