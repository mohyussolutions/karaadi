CREATE TABLE "MarketplaceCategory" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameSo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MarketplaceCategory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MarketplaceSubcategory" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameSo" TEXT NOT NULL,
    "categoryKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MarketplaceSubcategory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MarketplaceCategory_key_key" ON "MarketplaceCategory"("key");
CREATE UNIQUE INDEX "MarketplaceSubcategory_key_categoryKey_key" ON "MarketplaceSubcategory"("key", "categoryKey");

ALTER TABLE "MarketplaceSubcategory" ADD CONSTRAINT "MarketplaceSubcategory_categoryKey_fkey"
    FOREIGN KEY ("categoryKey") REFERENCES "MarketplaceCategory"("key")
    ON DELETE CASCADE ON UPDATE CASCADE;
