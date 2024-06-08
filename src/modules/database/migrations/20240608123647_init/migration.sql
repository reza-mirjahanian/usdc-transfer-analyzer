/*
  Warnings:

  - Added the required column `index` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionIndex` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "index" INTEGER NOT NULL,
ADD COLUMN     "transactionIndex" INTEGER NOT NULL;
