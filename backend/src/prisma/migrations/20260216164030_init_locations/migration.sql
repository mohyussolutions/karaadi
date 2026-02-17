/*
  Warnings:

  - You are about to drop the column `district` on the `Boat` table. All the data in the column will be lost.
  - You are about to drop the column `subDistrict` on the `Boat` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `listingType` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `subDistrict` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `subDistrict` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `Marketplace` table. All the data in the column will be lost.
  - You are about to drop the column `subDistrict` on the `Marketplace` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `Motorcycle` table. All the data in the column will be lost.
  - You are about to drop the column `subDistrict` on the `Motorcycle` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `RealEstate` table. All the data in the column will be lost.
  - You are about to drop the column `subDistrict` on the `RealEstate` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `Traktor` table. All the data in the column will be lost.
  - You are about to drop the column `subDistrict` on the `Traktor` table. All the data in the column will be lost.
  - You are about to drop the `Tractor` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Boat" DROP COLUMN "district",
DROP COLUMN "subDistrict";

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "district",
DROP COLUMN "listingType",
DROP COLUMN "subDistrict";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "district",
DROP COLUMN "subDistrict";

-- AlterTable
ALTER TABLE "Marketplace" DROP COLUMN "district",
DROP COLUMN "subDistrict";

-- AlterTable
ALTER TABLE "Motorcycle" DROP COLUMN "district",
DROP COLUMN "subDistrict";

-- AlterTable
ALTER TABLE "RealEstate" DROP COLUMN "district",
DROP COLUMN "subDistrict";

-- AlterTable
ALTER TABLE "Traktor" DROP COLUMN "district",
DROP COLUMN "subDistrict";

-- DropTable
DROP TABLE "Tractor";
