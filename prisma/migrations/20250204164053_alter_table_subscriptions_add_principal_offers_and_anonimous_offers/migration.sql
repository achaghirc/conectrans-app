-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "anonimousOffers" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "principalOffers" INTEGER NOT NULL DEFAULT 0;
