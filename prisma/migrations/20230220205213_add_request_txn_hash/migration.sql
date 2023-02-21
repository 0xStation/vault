/*
  Warnings:

  - A unique constraint covering the columns `[terminalId,number]` on the table `Request` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Request_number_idx";

-- DropIndex
DROP INDEX "Request_terminalId_number_key";

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "txnHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Request_terminalId_number_key" ON "Request"("terminalId", "number" DESC);
