/*
  Warnings:

  - A unique constraint covering the columns `[txHash]` on the table `TokenTransfer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `txHash` to the `TokenTransfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TokenTransfer" ADD COLUMN     "txHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TokenTransfer_txHash_key" ON "TokenTransfer"("txHash");
