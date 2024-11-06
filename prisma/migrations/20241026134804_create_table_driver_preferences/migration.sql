-- DropForeignKey
ALTER TABLE "DriverProfile" DROP CONSTRAINT "DriverProfile_employmentTypeId_fkey";

-- DropForeignKey
ALTER TABLE "DriverProfile" DROP CONSTRAINT "DriverProfile_workScopeId_fkey";

-- CreateTable
CREATE TABLE "DriverPreferences" (
    "id" SERIAL NOT NULL,
    "driverProfileId" INTEGER NOT NULL,
    "employmentTypeId" INTEGER NOT NULL,
    "workScopeId" INTEGER NOT NULL,

    CONSTRAINT "DriverPreferences_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DriverPreferences" ADD CONSTRAINT "DriverPreferences_driverProfileId_fkey" FOREIGN KEY ("driverProfileId") REFERENCES "DriverProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverPreferences" ADD CONSTRAINT "DriverPreferences_employmentTypeId_fkey" FOREIGN KEY ("employmentTypeId") REFERENCES "EncoderType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverPreferences" ADD CONSTRAINT "DriverPreferences_workScopeId_fkey" FOREIGN KEY ("workScopeId") REFERENCES "EncoderType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
