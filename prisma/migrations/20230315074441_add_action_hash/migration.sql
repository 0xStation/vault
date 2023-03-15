/*
  Warnings:

  - A unique constraint covering the columns `[actionHash]` on the table `Action` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "actionHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Action_actionHash_key" ON "Action"("actionHash");
