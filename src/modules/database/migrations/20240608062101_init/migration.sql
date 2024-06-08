-- CreateTable
CREATE TABLE "Log" (
    "id" VARCHAR(50) NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "transferAmount" INTEGER NOT NULL,
    "transactionHash" VARCHAR(50) NOT NULL,
    "fromAddress" VARCHAR(50) NOT NULL,
    "toAddress" VARCHAR(50) NOT NULL,
    "eventName" TEXT NOT NULL DEFAULT 'transfer',
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Log_fromAddress_idx" ON "Log"("fromAddress");

-- CreateIndex
CREATE INDEX "Log_toAddress_idx" ON "Log"("toAddress");

-- CreateIndex
CREATE INDEX "Log_timestamp_idx" ON "Log"("timestamp");
