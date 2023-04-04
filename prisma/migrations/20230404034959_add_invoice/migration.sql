-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "terminalAddress" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_terminalAddress_chainId_number_key" ON "Invoice"("terminalAddress", "chainId", "number" DESC);

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_chainId_terminalAddress_fkey" FOREIGN KEY ("chainId", "terminalAddress") REFERENCES "Terminal"("chainId", "safeAddress") ON DELETE RESTRICT ON UPDATE CASCADE;
