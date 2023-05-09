/*
  Warnings:

  - The values [SPLIT_TOKEN_TRANSFER] on the enum `RequestVariantType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Automation` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RequestVariantType_new" AS ENUM ('SIGNER_QUORUM', 'TOKEN_TRANSFER');
ALTER TABLE "Request" ALTER COLUMN "variant" TYPE "RequestVariantType_new" USING ("variant"::text::"RequestVariantType_new");
ALTER TYPE "RequestVariantType" RENAME TO "RequestVariantType_old";
ALTER TYPE "RequestVariantType_new" RENAME TO "RequestVariantType";
DROP TYPE "RequestVariantType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Automation" DROP CONSTRAINT "Automation_chainId_terminalAddress_fkey";

-- DropTable
DROP TABLE "Automation";

-- DropEnum
DROP TYPE "AutomationVariant";
