-- DropForeignKey
ALTER TABLE "ConnectionHistory" DROP CONSTRAINT "ConnectionHistory_userId_fkey";

-- AddForeignKey
ALTER TABLE "ConnectionHistory" ADD CONSTRAINT "ConnectionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
