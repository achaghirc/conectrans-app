-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "center" VARCHAR;

-- AlterTable
ALTER TABLE "Plan" ALTER COLUMN "priceMonthly" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "priceYearly" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);
