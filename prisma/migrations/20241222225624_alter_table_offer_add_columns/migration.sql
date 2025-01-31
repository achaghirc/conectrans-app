/*
  Warnings:

  - You are about to drop the column `driverLicenceId` on the `Offer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_driverLicenceId_fkey";

-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "driverLicenceId",
ADD COLUMN     "capCertification" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "digitalTachograph" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "OfferLicencePreferences" (
    "id" SERIAL NOT NULL,
    "offerId" INTEGER NOT NULL,
    "licenceTypeId" INTEGER NOT NULL,

    CONSTRAINT "OfferLicencePreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferEmploymentPreferences" (
    "id" SERIAL NOT NULL,
    "offerId" INTEGER NOT NULL,
    "employmentTypeId" INTEGER NOT NULL,

    CONSTRAINT "OfferEmploymentPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferWorkRangePreferences" (
    "id" SERIAL NOT NULL,
    "offerId" INTEGER NOT NULL,
    "workScopeId" INTEGER NOT NULL,

    CONSTRAINT "OfferWorkRangePreferences_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OfferLicencePreferences" ADD CONSTRAINT "OfferLicencePreferences_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferLicencePreferences" ADD CONSTRAINT "OfferLicencePreferences_licenceTypeId_fkey" FOREIGN KEY ("licenceTypeId") REFERENCES "EncoderType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferEmploymentPreferences" ADD CONSTRAINT "OfferEmploymentPreferences_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferEmploymentPreferences" ADD CONSTRAINT "OfferEmploymentPreferences_employmentTypeId_fkey" FOREIGN KEY ("employmentTypeId") REFERENCES "EncoderType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferWorkRangePreferences" ADD CONSTRAINT "OfferWorkRangePreferences_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferWorkRangePreferences" ADD CONSTRAINT "OfferWorkRangePreferences_workScopeId_fkey" FOREIGN KEY ("workScopeId") REFERENCES "EncoderType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
