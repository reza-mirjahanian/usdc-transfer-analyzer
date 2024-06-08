-- CreateTable
CREATE TABLE "Log" (
    "id" VARCHAR(50) NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "transactionIndex" INTEGER NOT NULL,
    "transferAmount" BIGINT NOT NULL,
    "transactionHash" VARCHAR(80) NOT NULL,
    "fromAddress" VARCHAR(50) NOT NULL,
    "toAddress" VARCHAR(50) NOT NULL,
    "tokenAddress" VARCHAR(50) NOT NULL,
    "eventName" TEXT NOT NULL DEFAULT 'transfer',
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "key" VARCHAR(50) NOT NULL,
    "value" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE INDEX "Log_fromAddress_idx" ON "Log"("fromAddress");

-- CreateIndex
CREATE INDEX "Log_toAddress_idx" ON "Log"("toAddress");

-- CreateIndex
CREATE INDEX "Log_timestamp_idx" ON "Log"("timestamp");

-- CreateIndex
CREATE INDEX "Log_blockNumber_idx" ON "Log"("blockNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Config_key_key" ON "Config"("key");
