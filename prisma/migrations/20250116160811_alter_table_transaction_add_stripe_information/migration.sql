-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "stripe_customer_id" TEXT,
ADD COLUMN     "stripe_payment_intent_id" TEXT,
ADD COLUMN     "stripe_payment_method_id" TEXT;
