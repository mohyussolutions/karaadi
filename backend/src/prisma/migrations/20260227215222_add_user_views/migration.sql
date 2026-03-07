/*
  Warnings:

  - You are about to drop the column `actionUrl` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Made the column `message` on table `Notification` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropIndex
DROP INDEX "Notification_category_idx";

-- DropIndex
DROP INDEX "Notification_userId_isRead_idx";

-- AlterTable
ALTER TABLE "Farmequipment" ALTER COLUMN "hours" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "actionUrl",
ADD COLUMN     "isDelivered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subscriptionId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "senderId" DROP NOT NULL,
ALTER COLUMN "message" SET NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "city",
ADD COLUMN     "cities" TEXT[],
ADD COLUMN     "customCities" TEXT[],
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "selectedCityIds" TEXT[],
ADD COLUMN     "totalFee" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "user_views" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_views_userId_idx" ON "user_views"("userId");

-- CreateIndex
CREATE INDEX "user_views_category_idx" ON "user_views"("category");

-- CreateIndex
CREATE INDEX "user_views_viewedAt_idx" ON "user_views"("viewedAt");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_senderId_idx" ON "Notification"("senderId");

-- CreateIndex
CREATE INDEX "Notification_subscriptionId_idx" ON "Notification"("subscriptionId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Notification_itemId_itemType_idx" ON "Notification"("itemId", "itemType");

-- CreateIndex
CREATE INDEX "Subscription_cities_idx" ON "Subscription"("cities");

-- CreateIndex
CREATE INDEX "Subscription_expiryDate_idx" ON "Subscription"("expiryDate");

-- AddForeignKey
ALTER TABLE "user_views" ADD CONSTRAINT "user_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
