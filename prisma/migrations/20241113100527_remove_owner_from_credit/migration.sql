/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Credit` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Credit" DROP CONSTRAINT "Credit_ownerId_fkey";

-- AlterTable
ALTER TABLE "Credit" DROP COLUMN "ownerId";
