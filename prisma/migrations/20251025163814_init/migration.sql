/*
  Warnings:

  - Changed the type of `type` on the `Question` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "invoiceUrl" TEXT,
ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "stripeTransactionId" TEXT;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;
