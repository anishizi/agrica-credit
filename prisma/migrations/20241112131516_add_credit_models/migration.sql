-- CreateTable
CREATE TABLE "Credit" (
    "id" SERIAL NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "moisDebut" TIMESTAMP(3) NOT NULL,
    "duree" INTEGER NOT NULL,
    "tauxInteret" DOUBLE PRECISION NOT NULL,
    "tauxAssurance" DOUBLE PRECISION NOT NULL,
    "tauxRemboursement" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Credit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditParticipant" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "creditId" INTEGER NOT NULL,
    "montantParParticipant" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CreditParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyInstallment" (
    "id" SERIAL NOT NULL,
    "creditId" INTEGER NOT NULL,
    "creditParticipantId" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Non payé',

    CONSTRAINT "MonthlyInstallment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CreditParticipant" ADD CONSTRAINT "CreditParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditParticipant" ADD CONSTRAINT "CreditParticipant_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "Credit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyInstallment" ADD CONSTRAINT "MonthlyInstallment_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "Credit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyInstallment" ADD CONSTRAINT "MonthlyInstallment_creditParticipantId_fkey" FOREIGN KEY ("creditParticipantId") REFERENCES "CreditParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
