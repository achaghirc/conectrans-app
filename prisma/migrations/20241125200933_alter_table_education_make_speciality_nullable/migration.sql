/*
  Warnings:

  - You are about to drop the column `specialty` on the `Education` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Education" DROP COLUMN "specialty",
ADD COLUMN     "speciality" VARCHAR;
