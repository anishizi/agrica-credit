/*
  Warnings:

  - Added the required column `monthlyPayment` to the `Credit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Credit" ADD COLUMN     "monthlyPayment" DOUBLE PRECISION NOT NULL;
