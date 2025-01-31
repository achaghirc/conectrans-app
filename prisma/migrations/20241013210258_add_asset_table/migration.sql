/*
  Warnings:

  - You are about to drop the column `cif` on the `Company` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[assetId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "cif",
ADD COLUMN     "assetId" INTEGER;

-- CreateTable
CREATE TABLE "Asset" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_assetId_key" ON "Company"("assetId");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
