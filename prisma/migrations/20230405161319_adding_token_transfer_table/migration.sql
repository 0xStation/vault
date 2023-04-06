-- CreateTable
CREATE TABLE "TokenTransfer" (
    "id" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "terminalAddress" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "TokenTransfer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TokenTransfer" ADD CONSTRAINT "TokenTransfer_chainId_terminalAddress_fkey" FOREIGN KEY ("chainId", "terminalAddress") REFERENCES "Terminal"("chainId", "safeAddress") ON DELETE RESTRICT ON UPDATE CASCADE;
