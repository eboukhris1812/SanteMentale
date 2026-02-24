/*
  Warnings:

  - Added the required column `burnout` to the `Bilan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `critique` to the `Bilan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bilan" ADD COLUMN     "burnout" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "critique" DOUBLE PRECISION NOT NULL;
