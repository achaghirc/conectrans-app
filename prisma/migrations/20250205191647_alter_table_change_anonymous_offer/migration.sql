/*
  Warnings:

  - You are about to drop the column `anonimousOffers` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `anonimousOffers` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "anonimousOffers",
ADD COLUMN     "anonymousOffers" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "anonimousOffers",
ADD COLUMN     "anonymousOffers" INTEGER NOT NULL DEFAULT 0;
