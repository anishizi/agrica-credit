/*
  Warnings:

  - You are about to drop the `Credit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Installment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserCredits` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Installment" DROP CONSTRAINT "Installment_creditId_fkey";

-- DropForeignKey
ALTER TABLE "Installment" DROP CONSTRAINT "Installment_userId_fkey";

-- DropForeignKey
ALTER TABLE "_UserCredits" DROP CONSTRAINT "_UserCredits_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserCredits" DROP CONSTRAINT "_UserCredits_B_fkey";

-- DropTable
DROP TABLE "Credit";

-- DropTable
DROP TABLE "Installment";

-- DropTable
DROP TABLE "_UserCredits";
