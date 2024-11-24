/*
  Warnings:

  - You are about to drop the `Credit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CreditParticipant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CreditParticipant" DROP CONSTRAINT "CreditParticipant_creditId_fkey";

-- DropForeignKey
ALTER TABLE "CreditParticipant" DROP CONSTRAINT "CreditParticipant_userId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_creditId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_participantId_fkey";

-- DropTable
DROP TABLE "Credit";

-- DropTable
DROP TABLE "CreditParticipant";

-- DropTable
DROP TABLE "Schedule";
