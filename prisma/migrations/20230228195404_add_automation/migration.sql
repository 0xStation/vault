-- CreateEnum
CREATE TYPE "AutomationVariant" AS ENUM ('REV_SHARE');

-- CreateTable
CREATE TABLE "Automation" (
    "id" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "terminalAddress" TEXT NOT NULL,
    "variant" "AutomationVariant" NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Automation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Automation" ADD CONSTRAINT "Automation_chainId_terminalAddress_fkey" FOREIGN KEY ("chainId", "terminalAddress") REFERENCES "Terminal"("chainId", "safeAddress") ON DELETE RESTRICT ON UPDATE CASCADE;
