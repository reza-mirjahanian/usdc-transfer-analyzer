/*
  Warnings:

  - Added the required column `tokenAddress` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "tokenAddress" VARCHAR(50) NOT NULL,
ALTER COLUMN "transferAmount" SET DATA TYPE BIGINT;

-- CreateIndex
CREATE INDEX "Log_blockNumber_idx" ON "Log"("blockNumber");
