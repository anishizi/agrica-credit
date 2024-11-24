-- CreateTable
CREATE TABLE "Credit" (
    "id" SERIAL NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "tauxInteret" DOUBLE PRECISION NOT NULL,
    "dureeMois" INTEGER NOT NULL,
    "moisDebut" TIMESTAMP(3) NOT NULL,
    "montantMensuel" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Credit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditParticipant" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "creditId" INTEGER NOT NULL,
    "montantParMois" DOUBLE PRECISION NOT NULL,
    "statutPaiement" TEXT NOT NULL DEFAULT 'Non payé',
    "mois" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditParticipant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Credit" ADD CONSTRAINT "Credit_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditParticipant" ADD CONSTRAINT "CreditParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditParticipant" ADD CONSTRAINT "CreditParticipant_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "Credit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
