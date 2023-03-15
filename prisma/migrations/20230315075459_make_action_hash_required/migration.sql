/*
  Warnings:

  - Made the column `actionHash` on table `Action` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Action" ALTER COLUMN "actionHash" SET NOT NULL;
