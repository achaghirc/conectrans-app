/*
  Warnings:

  - You are about to drop the column `employmentTypeId` on the `DriverProfile` table. All the data in the column will be lost.
  - You are about to drop the column `workScopeId` on the `DriverProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DriverProfile" DROP COLUMN "employmentTypeId",
DROP COLUMN "workScopeId";
