/*
  Warnings:

  - You are about to drop the `DriverPreferences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DriverPreferences" DROP CONSTRAINT "DriverPreferences_driverProfileId_fkey";

-- DropForeignKey
ALTER TABLE "DriverPreferences" DROP CONSTRAINT "DriverPreferences_employmentTypeId_fkey";

-- DropForeignKey
ALTER TABLE "DriverPreferences" DROP CONSTRAINT "DriverPreferences_workScopeId_fkey";

-- DropTable
DROP TABLE "DriverPreferences";

-- CreateTable
CREATE TABLE "DriverWorkRangePreferences" (
    "id" SERIAL NOT NULL,
    "driverProfileId" INTEGER NOT NULL,
    "workScopeId" INTEGER NOT NULL,

    CONSTRAINT "DriverWorkRangePreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverEmploymentPreferences" (
    "id" SERIAL NOT NULL,
    "driverProfileId" INTEGER NOT NULL,
    "employmentTypeId" INTEGER NOT NULL,

    CONSTRAINT "DriverEmploymentPreferences_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DriverWorkRangePreferences" ADD CONSTRAINT "DriverWorkRangePreferences_driverProfileId_fkey" FOREIGN KEY ("driverProfileId") REFERENCES "DriverProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverWorkRangePreferences" ADD CONSTRAINT "DriverWorkRangePreferences_workScopeId_fkey" FOREIGN KEY ("workScopeId") REFERENCES "EncoderType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverEmploymentPreferences" ADD CONSTRAINT "DriverEmploymentPreferences_driverProfileId_fkey" FOREIGN KEY ("driverProfileId") REFERENCES "DriverProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverEmploymentPreferences" ADD CONSTRAINT "DriverEmploymentPreferences_employmentTypeId_fkey" FOREIGN KEY ("employmentTypeId") REFERENCES "EncoderType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
