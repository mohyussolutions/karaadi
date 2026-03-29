/*
  Warnings:

  - You are about to drop the column `subPremium` on the `SubPlan` table. All the data in the column will be lost.
  - You are about to drop the column `subStandard` on the `SubPlan` table. All the data in the column will be lost.
  - You are about to drop the column `subStandard60` on the `SubPlan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SubPlan" DROP COLUMN "subPremium",
DROP COLUMN "subStandard",
DROP COLUMN "subStandard60",
ADD COLUMN     "basic30" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "premium90" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "standard60" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
