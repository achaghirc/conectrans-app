/*
  Warnings:

  - You are about to drop the `EmployeeTypes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExperienceType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LicenceType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `licencesCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workScope` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DriverLicence" DROP CONSTRAINT "DriverLicence_licenceTypeId_fkey";

-- DropForeignKey
ALTER TABLE "DriverProfile" DROP CONSTRAINT "DriverProfile_employmentTypeId_fkey";

-- DropForeignKey
ALTER TABLE "DriverProfile" DROP CONSTRAINT "DriverProfile_workScopeId_fkey";

-- DropForeignKey
ALTER TABLE "Experience" DROP CONSTRAINT "Experience_experienceTypeId_fkey";

-- DropTable
DROP TABLE "EmployeeTypes";

-- DropTable
DROP TABLE "ExperienceType";

-- DropTable
DROP TABLE "LicenceType";

-- DropTable
DROP TABLE "licencesCategory";

-- DropTable
DROP TABLE "workScope";

-- CreateTable
CREATE TABLE "EncoderType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "code" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,

    CONSTRAINT "EncoderType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DriverProfile" ADD CONSTRAINT "DriverProfile_employmentTypeId_fkey" FOREIGN KEY ("employmentTypeId") REFERENCES "EncoderType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverProfile" ADD CONSTRAINT "DriverProfile_workScopeId_fkey" FOREIGN KEY ("workScopeId") REFERENCES "EncoderType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverLicence" ADD CONSTRAINT "DriverLicence_licenceTypeId_fkey" FOREIGN KEY ("licenceTypeId") REFERENCES "EncoderType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_experienceTypeId_fkey" FOREIGN KEY ("experienceTypeId") REFERENCES "EncoderType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
