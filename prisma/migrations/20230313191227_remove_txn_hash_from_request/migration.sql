/*
  Warnings:

  - You are about to drop the column `txnHash` on the `Request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Request" DROP COLUMN "txnHash";
