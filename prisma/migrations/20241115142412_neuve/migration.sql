/*
  Warnings:

  - You are about to drop the `Credit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CreditContributor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentCalendar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CreditToPaymentCalendar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CreditContributor" DROP CONSTRAINT "CreditContributor_creditId_fkey";

-- DropForeignKey
ALTER TABLE "CreditContributor" DROP CONSTRAINT "CreditContributor_userId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentCalendar" DROP CONSTRAINT "PaymentCalendar_creditContributorId_fkey";

-- DropForeignKey
ALTER TABLE "_CreditToPaymentCalendar" DROP CONSTRAINT "_CreditToPaymentCalendar_A_fkey";

-- DropForeignKey
ALTER TABLE "_CreditToPaymentCalendar" DROP CONSTRAINT "_CreditToPaymentCalendar_B_fkey";

-- DropTable
DROP TABLE "Credit";

-- DropTable
DROP TABLE "CreditContributor";

-- DropTable
DROP TABLE "PaymentCalendar";

-- DropTable
DROP TABLE "_CreditToPaymentCalendar";
