/*
  Warnings:

  - You are about to drop the column `terminalId` on the `Request` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[terminalAddress,chainId,number]` on the table `Request` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chainId` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `terminalAddress` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_terminalId_fkey";

-- DropIndex
DROP INDEX "Request_terminalId_number_key";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "terminalId",
ADD COLUMN     "chainId" INTEGER NOT NULL,
ADD COLUMN     "terminalAddress" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Request_terminalAddress_chainId_number_key" ON "Request"("terminalAddress", "chainId", "number" DESC);

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_terminalAddress_chainId_fkey" FOREIGN KEY ("terminalAddress", "chainId") REFERENCES "Terminal"("safeAddress", "chainId") ON DELETE RESTRICT ON UPDATE CASCADE;
