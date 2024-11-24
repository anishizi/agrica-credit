-- CreateTable
CREATE TABLE "Credit" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "fees" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Credit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditContributor" (
    "id" SERIAL NOT NULL,
    "creditId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "monthlyPayment" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CreditContributor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentCalendar" (
    "id" SERIAL NOT NULL,
    "creditContributorId" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "amountDue" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "PaymentCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CreditToPaymentCalendar" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CreditToPaymentCalendar_AB_unique" ON "_CreditToPaymentCalendar"("A", "B");

-- CreateIndex
CREATE INDEX "_CreditToPaymentCalendar_B_index" ON "_CreditToPaymentCalendar"("B");

-- AddForeignKey
ALTER TABLE "CreditContributor" ADD CONSTRAINT "CreditContributor_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "Credit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditContributor" ADD CONSTRAINT "CreditContributor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentCalendar" ADD CONSTRAINT "PaymentCalendar_creditContributorId_fkey" FOREIGN KEY ("creditContributorId") REFERENCES "CreditContributor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreditToPaymentCalendar" ADD CONSTRAINT "_CreditToPaymentCalendar_A_fkey" FOREIGN KEY ("A") REFERENCES "Credit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreditToPaymentCalendar" ADD CONSTRAINT "_CreditToPaymentCalendar_B_fkey" FOREIGN KEY ("B") REFERENCES "PaymentCalendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
