-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "has_car" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "relocateOption" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "country" (
    "id" INTEGER NOT NULL,
    "name_es" VARCHAR NOT NULL,
    "name_en" VARCHAR NOT NULL,
    "cod_iso2" VARCHAR(10),
    "cod_iso3" VARCHAR(10),
    "phone_code" VARCHAR(10),

    CONSTRAINT "country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "province" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,
    "cod_iso2" VARCHAR NOT NULL,
    "country_id" INTEGER,

    CONSTRAINT "province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Languages" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "code" VARCHAR NOT NULL,

    CONSTRAINT "Languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonLanguages" (
    "id" SERIAL NOT NULL,
    "personId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "level" VARCHAR NOT NULL,

    CONSTRAINT "PersonLanguages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverProfile" (
    "id" SERIAL NOT NULL,
    "personId" INTEGER NOT NULL,
    "hasCapCertification" BOOLEAN NOT NULL DEFAULT false,
    "hasDigitalTachograph" BOOLEAN NOT NULL DEFAULT false,
    "employmentTypeId" INTEGER NOT NULL,
    "workScopeId" INTEGER NOT NULL,

    CONSTRAINT "DriverProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverLicence" (
    "id" SERIAL NOT NULL,
    "driverProfileId" INTEGER NOT NULL,
    "licenceTypeId" INTEGER NOT NULL,
    "countryId" INTEGER NOT NULL,

    CONSTRAINT "DriverLicence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LicenceType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "code" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "LicenceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "code" VARCHAR NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "ExperienceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" SERIAL NOT NULL,
    "jobName" VARCHAR NOT NULL,
    "startYear" TIMESTAMP(3) NOT NULL,
    "endYear" TIMESTAMP(3) NOT NULL,
    "description" VARCHAR NOT NULL,
    "personId" INTEGER NOT NULL,
    "experienceTypeId" INTEGER NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" SERIAL NOT NULL,
    "personId" INTEGER,
    "title" VARCHAR NOT NULL,
    "specialty" VARCHAR NOT NULL,
    "startYear" TIMESTAMP(3) NOT NULL,
    "endYear" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "licencesCategory" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "code" VARCHAR NOT NULL,

    CONSTRAINT "licencesCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workScope" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "code" VARCHAR NOT NULL,

    CONSTRAINT "workScope_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeTypes" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "code" VARCHAR NOT NULL,

    CONSTRAINT "EmployeeTypes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "province" ADD CONSTRAINT "province_country_fk" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PersonLanguages" ADD CONSTRAINT "PersonLanguages_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonLanguages" ADD CONSTRAINT "PersonLanguages_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverProfile" ADD CONSTRAINT "DriverProfile_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverProfile" ADD CONSTRAINT "DriverProfile_employmentTypeId_fkey" FOREIGN KEY ("employmentTypeId") REFERENCES "EmployeeTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverProfile" ADD CONSTRAINT "DriverProfile_workScopeId_fkey" FOREIGN KEY ("workScopeId") REFERENCES "workScope"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverLicence" ADD CONSTRAINT "DriverLicence_driverProfileId_fkey" FOREIGN KEY ("driverProfileId") REFERENCES "DriverProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverLicence" ADD CONSTRAINT "DriverLicence_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverLicence" ADD CONSTRAINT "DriverLicence_licenceTypeId_fkey" FOREIGN KEY ("licenceTypeId") REFERENCES "LicenceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_experienceTypeId_fkey" FOREIGN KEY ("experienceTypeId") REFERENCES "ExperienceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
