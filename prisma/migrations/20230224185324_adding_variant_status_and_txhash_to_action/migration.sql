/*
  Warnings:

  - You are about to drop the column `isRejection` on the `Action` table. All the data in the column will be lost.
  - Added the required column `status` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variant` to the `Action` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ActionVariant" AS ENUM ('APPROVAL', 'REJECTION');

-- CreateEnum
CREATE TYPE "ActionStatus" AS ENUM ('NONE', 'PENDING', 'SUCCESS', 'FAILURE');

-- AlterTable
ALTER TABLE "Action" DROP COLUMN "isRejection",
ADD COLUMN     "status" "ActionStatus" NOT NULL,
ADD COLUMN     "txHash" TEXT,
ADD COLUMN     "variant" "ActionVariant" NOT NULL;
