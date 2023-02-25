/*
  Warnings:

  - Added the required column `variant` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubscriptionVariant" AS ENUM ('TOKEN_RECIPIENT');

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "variant" "SubscriptionVariant" NOT NULL;
