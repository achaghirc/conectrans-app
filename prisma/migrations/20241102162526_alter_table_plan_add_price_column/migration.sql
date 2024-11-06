/*
  Warnings:

  - You are about to alter the column `priceMonthly` on the `Plan` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `priceYearly` on the `Plan` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `priceBianual` on the `Plan` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - Added the required column `endDate` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Offer" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "priceMonthly" SET DEFAULT 0,
ALTER COLUMN "priceMonthly" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "priceYearly" SET DEFAULT 0,
ALTER COLUMN "priceYearly" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "priceBianual" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" VARCHAR NOT NULL DEFAULT 'pending',
ADD COLUMN     "stripeSubscriptionId" TEXT;
