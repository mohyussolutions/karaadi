-- AlterTable
ALTER TABLE "Cookie" ADD COLUMN     "accessToken" TEXT;

-- CreateIndex
CREATE INDEX "Cookie_accessToken_idx" ON "Cookie"("accessToken");
