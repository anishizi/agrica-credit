-- CreateTable
CREATE TABLE "Credit" (
    "id" SERIAL NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "moisDebut" TIMESTAMP(3) NOT NULL,
    "tauxInteret" DOUBLE PRECISION NOT NULL,
    "dureeMois" INTEGER NOT NULL,
    "montantMensuel" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Credit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "creditId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "mois" INTEGER NOT NULL,
    "annee" INTEGER NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Non payé',

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserCredits" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserCredits_AB_unique" ON "_UserCredits"("A", "B");

-- CreateIndex
CREATE INDEX "_UserCredits_B_index" ON "_UserCredits"("B");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "Credit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserCredits" ADD CONSTRAINT "_UserCredits_A_fkey" FOREIGN KEY ("A") REFERENCES "Credit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserCredits" ADD CONSTRAINT "_UserCredits_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
