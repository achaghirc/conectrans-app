/*
  Warnings:

  - You are about to drop the `OfferEmploymentPreferences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OfferLicencePreferences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OfferWorkRangePreferences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OfferEmploymentPreferences" DROP CONSTRAINT "OfferEmploymentPreferences_employmentTypeId_fkey";

-- DropForeignKey
ALTER TABLE "OfferEmploymentPreferences" DROP CONSTRAINT "OfferEmploymentPreferences_offerId_fkey";

-- DropForeignKey
ALTER TABLE "OfferLicencePreferences" DROP CONSTRAINT "OfferLicencePreferences_licenceTypeId_fkey";

-- DropForeignKey
ALTER TABLE "OfferLicencePreferences" DROP CONSTRAINT "OfferLicencePreferences_offerId_fkey";

-- DropForeignKey
ALTER TABLE "OfferWorkRangePreferences" DROP CONSTRAINT "OfferWorkRangePreferences_offerId_fkey";

-- DropForeignKey
ALTER TABLE "OfferWorkRangePreferences" DROP CONSTRAINT "OfferWorkRangePreferences_workScopeId_fkey";

-- DropTable
DROP TABLE "OfferEmploymentPreferences";

-- DropTable
DROP TABLE "OfferLicencePreferences";

-- DropTable
DROP TABLE "OfferWorkRangePreferences";

-- CreateTable
CREATE TABLE "OfferPreferences" (
    "id" SERIAL NOT NULL,
    "offerId" INTEGER NOT NULL,
    "encoderTypeId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "OfferPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "offer_preferences_offerid_idx" ON "OfferPreferences"("offerId");

-- CreateIndex
CREATE INDEX "offer_preferences_type_code" ON "OfferPreferences"("type");

-- AddForeignKey
ALTER TABLE "OfferPreferences" ADD CONSTRAINT "OfferPreferences_encoderTypeId_fkey" FOREIGN KEY ("encoderTypeId") REFERENCES "EncoderType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferPreferences" ADD CONSTRAINT "OfferPreferences_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
