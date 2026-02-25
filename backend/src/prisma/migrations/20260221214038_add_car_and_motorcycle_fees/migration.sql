-- CreateEnum
CREATE TYPE "ItemCategory" AS ENUM ('CAR', 'REAL_ESTATE', 'BOAT', 'MOTORCYCLE', 'TRAKTOR', 'MARKETPLACE', 'SUBSCRIPTION');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NEW', 'IN_PROGRESS', 'DONE', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'SUPPORT_MANAGER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('FREE', 'FEE');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "cognitoId" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "profileImage" TEXT,
    "phone" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isManager" BOOLEAN NOT NULL DEFAULT false,
    "isSupport" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastSeenAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visitor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cookie" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cookie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Marketplace" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "so" TEXT,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "mainCategory" TEXT NOT NULL,
    "category" TEXT[],
    "subcategory" TEXT[],
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "images" TEXT[],
    "extra" JSONB,
    "maGaday" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "expiryDate" TIMESTAMP(3),
    "feeId" TEXT,
    "feeAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "planId" TEXT,
    "planAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Marketplace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RealEstate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "mainCategory" TEXT NOT NULL,
    "category" TEXT[],
    "subcategory" TEXT[],
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "squareFeet" INTEGER,
    "address" TEXT NOT NULL,
    "hasGarage" BOOLEAN,
    "hasGarden" BOOLEAN,
    "region" TEXT NOT NULL,
    "so" TEXT,
    "city" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "images" TEXT[],
    "maGaday" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "expiryDate" TIMESTAMP(3),
    "feeId" TEXT,
    "feeAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "planId" TEXT,
    "planAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "RealEstate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Boat" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "mainCategory" TEXT NOT NULL,
    "category" TEXT[],
    "subcategory" TEXT[],
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "so" TEXT,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "images" TEXT[],
    "type" TEXT NOT NULL,
    "boatModel" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "maGaday" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "expiryDate" TIMESTAMP(3),
    "feeId" TEXT,
    "feeAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "planId" TEXT,
    "planAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Boat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "so" TEXT,
    "mainCategory" TEXT NOT NULL,
    "category" TEXT[],
    "subcategory" TEXT[],
    "brand" TEXT NOT NULL,
    "vehicleModel" TEXT NOT NULL,
    "year" INTEGER,
    "mileage" INTEGER,
    "transmission" TEXT,
    "fuelType" TEXT,
    "color" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "images" TEXT[],
    "maGaday" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "expiryDate" TIMESTAMP(3),
    "feeId" TEXT,
    "feeAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "planId" TEXT,
    "planAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Motorcycle" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "transmission" TEXT,
    "mainCategory" TEXT NOT NULL,
    "category" TEXT[],
    "subcategory" TEXT[],
    "price" DOUBLE PRECISION NOT NULL,
    "so" TEXT,
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "images" TEXT[],
    "type" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "engineSize" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "maGaday" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "expiryDate" TIMESTAMP(3),
    "feeId" TEXT,
    "feeAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "planId" TEXT,
    "planAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Motorcycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farmequipment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "mainCategory" TEXT NOT NULL,
    "category" TEXT[],
    "subcategory" TEXT[],
    "so" TEXT,
    "type" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "farmequipmentModel" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "condition" TEXT NOT NULL,
    "hours" INTEGER NOT NULL,
    "enginePower" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "images" TEXT[],
    "maGaday" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "expiryDate" TIMESTAMP(3),
    "feeId" TEXT,
    "feeAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "planId" TEXT,
    "planAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Farmequipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "salary" DOUBLE PRECISION NOT NULL,
    "mainCategory" TEXT NOT NULL,
    "category" TEXT[],
    "subcategory" TEXT[],
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "employmentType" TEXT NOT NULL,
    "experienceLevel" TEXT NOT NULL,
    "images" TEXT[],
    "maGaday" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "expiryDate" TIMESTAMP(3),
    "feeId" TEXT,
    "feeAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "planId" TEXT,
    "planAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Advertisement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "buttonText" TEXT DEFAULT 'Learn More',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "position" TEXT NOT NULL DEFAULT 'general',
    "priority" INTEGER NOT NULL DEFAULT 1,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Advertisement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agency" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Verified',
    "image" TEXT NOT NULL,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "boatId" TEXT,
    "carId" TEXT,
    "motorcycleId" TEXT,
    "realEstateId" TEXT,
    "marketplaceId" TEXT,
    "traktorId" TEXT,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" TIMESTAMP(3),
    "archivedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastMessageAt" TIMESTAMP(3),
    "farmequipmentId" TEXT,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "chatId" INTEGER NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "edited" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "replyToId" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerSupportTicket" (
    "id" SERIAL NOT NULL,
    "senderName" TEXT NOT NULL,
    "senderEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'NEW',
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "adminReply" TEXT,
    "assignedTo" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerSupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketMessage" (
    "id" SERIAL NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "senderRole" "Role" NOT NULL DEFAULT 'USER',
    "senderName" TEXT NOT NULL,
    "senderEmail" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "attachments" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subCategory" TEXT,
    "priceMin" INTEGER,
    "priceMax" INTEGER,
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "description" TEXT,
    "condition" TEXT,
    "brand" TEXT,
    "model" TEXT,
    "specificFeatures" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'active',
    "lastNotified" TIMESTAMP(3),
    "read" BOOLEAN NOT NULL DEFAULT false,
    "notificationCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "expiryDate" TIMESTAMP(3),

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT,
    "category" TEXT NOT NULL,
    "subCategory" TEXT,
    "itemId" TEXT,
    "itemType" TEXT,
    "region" TEXT,
    "city" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "actionUrl" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT,
    "image" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchLog" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "category" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transactionId" TEXT,
    "paymentMethod" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "feeAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "planAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "platformFee" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "listingType" "ListingType" NOT NULL DEFAULT 'FEE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "marketplaceId" TEXT,
    "realEstateId" TEXT,
    "boatId" TEXT,
    "carId" TEXT,
    "motorcycleId" TEXT,
    "farmequipmentId" TEXT,
    "jobId" TEXT,
    "subscriptionId" TEXT,
    "marketplaceFeeId" TEXT,
    "realEstateFeeId" TEXT,
    "boatFeeId" TEXT,
    "carFeeId" TEXT,
    "motorcycleFeeId" TEXT,
    "equipmentFeeId" TEXT,
    "planConfigId" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceFee" (
    "id" TEXT NOT NULL,
    "art" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "electronics" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "animal" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "sports" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "furniture" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "fashion" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketplaceFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RealEstateFee" (
    "id" TEXT NOT NULL,
    "rent" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "sale" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "land" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "farm" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "business" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RealEstateFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarFee" (
    "id" TEXT NOT NULL,
    "carSale" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "carRent" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "trailer" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "carParts" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "truck" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "electricCar" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MotorcycleFee" (
    "id" TEXT NOT NULL,
    "motoSale" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "motoRent" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "motoParts" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MotorcycleFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoatFee" (
    "id" TEXT NOT NULL,
    "boatSale" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "boatRent" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "boatEngine" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "boatParts" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoatFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentFeeConfig" (
    "id" TEXT NOT NULL,
    "tractorSale" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "agriTool" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "harvester" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "fullTime" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "partTime" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "freelance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EquipmentFeeConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" TEXT NOT NULL,
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "platformFee" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "waafiFee" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubPlan" (
    "id" TEXT NOT NULL,
    "subStandard" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "subStandard60" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "subPremium" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeeChangeLog" (
    "id" TEXT NOT NULL,
    "feeConfigId" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changes" JSONB NOT NULL,
    "previousValues" JSONB NOT NULL,
    "newValues" JSONB NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeeChangeLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MarketplaceToMessage" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MarketplaceToMessage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserAgencies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserAgencies_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ChatToJob" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ChatToJob_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MessageToRealEstate" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MessageToRealEstate_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_cognitoId_key" ON "User"("cognitoId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_userId_key" ON "Visitor"("userId");

-- CreateIndex
CREATE INDEX "Visitor_visitedAt_idx" ON "Visitor"("visitedAt");

-- CreateIndex
CREATE INDEX "Visitor_ipAddress_idx" ON "Visitor"("ipAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Cookie_userId_key" ON "Cookie"("userId");

-- CreateIndex
CREATE INDEX "Cookie_token_idx" ON "Cookie"("token");

-- CreateIndex
CREATE INDEX "Cookie_expiresAt_idx" ON "Cookie"("expiresAt");

-- CreateIndex
CREATE INDEX "Marketplace_isPaid_idx" ON "Marketplace"("isPaid");

-- CreateIndex
CREATE INDEX "Marketplace_createdAt_idx" ON "Marketplace"("createdAt");

-- CreateIndex
CREATE INDEX "Marketplace_userId_idx" ON "Marketplace"("userId");

-- CreateIndex
CREATE INDEX "Marketplace_region_idx" ON "Marketplace"("region");

-- CreateIndex
CREATE INDEX "Marketplace_feeId_idx" ON "Marketplace"("feeId");

-- CreateIndex
CREATE INDEX "Marketplace_planId_idx" ON "Marketplace"("planId");

-- CreateIndex
CREATE INDEX "RealEstate_isPaid_idx" ON "RealEstate"("isPaid");

-- CreateIndex
CREATE INDEX "RealEstate_createdAt_idx" ON "RealEstate"("createdAt");

-- CreateIndex
CREATE INDEX "RealEstate_userId_idx" ON "RealEstate"("userId");

-- CreateIndex
CREATE INDEX "RealEstate_region_idx" ON "RealEstate"("region");

-- CreateIndex
CREATE INDEX "RealEstate_feeId_idx" ON "RealEstate"("feeId");

-- CreateIndex
CREATE INDEX "RealEstate_planId_idx" ON "RealEstate"("planId");

-- CreateIndex
CREATE INDEX "Boat_isPaid_idx" ON "Boat"("isPaid");

-- CreateIndex
CREATE INDEX "Boat_createdAt_idx" ON "Boat"("createdAt");

-- CreateIndex
CREATE INDEX "Boat_userId_idx" ON "Boat"("userId");

-- CreateIndex
CREATE INDEX "Boat_region_idx" ON "Boat"("region");

-- CreateIndex
CREATE INDEX "Boat_feeId_idx" ON "Boat"("feeId");

-- CreateIndex
CREATE INDEX "Boat_planId_idx" ON "Boat"("planId");

-- CreateIndex
CREATE INDEX "Car_isPaid_idx" ON "Car"("isPaid");

-- CreateIndex
CREATE INDEX "Car_createdAt_idx" ON "Car"("createdAt");

-- CreateIndex
CREATE INDEX "Car_userId_idx" ON "Car"("userId");

-- CreateIndex
CREATE INDEX "Car_region_idx" ON "Car"("region");

-- CreateIndex
CREATE INDEX "Car_feeId_idx" ON "Car"("feeId");

-- CreateIndex
CREATE INDEX "Car_planId_idx" ON "Car"("planId");

-- CreateIndex
CREATE INDEX "Motorcycle_isPaid_idx" ON "Motorcycle"("isPaid");

-- CreateIndex
CREATE INDEX "Motorcycle_createdAt_idx" ON "Motorcycle"("createdAt");

-- CreateIndex
CREATE INDEX "Motorcycle_userId_idx" ON "Motorcycle"("userId");

-- CreateIndex
CREATE INDEX "Motorcycle_region_idx" ON "Motorcycle"("region");

-- CreateIndex
CREATE INDEX "Motorcycle_feeId_idx" ON "Motorcycle"("feeId");

-- CreateIndex
CREATE INDEX "Motorcycle_planId_idx" ON "Motorcycle"("planId");

-- CreateIndex
CREATE INDEX "Farmequipment_isPaid_idx" ON "Farmequipment"("isPaid");

-- CreateIndex
CREATE INDEX "Farmequipment_createdAt_idx" ON "Farmequipment"("createdAt");

-- CreateIndex
CREATE INDEX "Farmequipment_userId_idx" ON "Farmequipment"("userId");

-- CreateIndex
CREATE INDEX "Farmequipment_region_idx" ON "Farmequipment"("region");

-- CreateIndex
CREATE INDEX "Farmequipment_feeId_idx" ON "Farmequipment"("feeId");

-- CreateIndex
CREATE INDEX "Farmequipment_planId_idx" ON "Farmequipment"("planId");

-- CreateIndex
CREATE INDEX "Job_isPaid_idx" ON "Job"("isPaid");

-- CreateIndex
CREATE INDEX "Job_createdAt_idx" ON "Job"("createdAt");

-- CreateIndex
CREATE INDEX "Job_userId_idx" ON "Job"("userId");

-- CreateIndex
CREATE INDEX "Job_region_idx" ON "Job"("region");

-- CreateIndex
CREATE INDEX "Job_feeId_idx" ON "Job"("feeId");

-- CreateIndex
CREATE INDEX "Job_planId_idx" ON "Job"("planId");

-- CreateIndex
CREATE INDEX "Advertisement_position_idx" ON "Advertisement"("position");

-- CreateIndex
CREATE INDEX "Advertisement_isActive_idx" ON "Advertisement"("isActive");

-- CreateIndex
CREATE INDEX "Advertisement_priority_idx" ON "Advertisement"("priority");

-- CreateIndex
CREATE INDEX "Advertisement_userId_idx" ON "Advertisement"("userId");

-- CreateIndex
CREATE INDEX "Chat_senderId_receiverId_idx" ON "Chat"("senderId", "receiverId");

-- CreateIndex
CREATE INDEX "Chat_updatedAt_idx" ON "Chat"("updatedAt");

-- CreateIndex
CREATE INDEX "Chat_isArchived_idx" ON "Chat"("isArchived");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_senderId_receiverId_boatId_key" ON "Chat"("senderId", "receiverId", "boatId");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_senderId_receiverId_carId_key" ON "Chat"("senderId", "receiverId", "carId");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_senderId_receiverId_motorcycleId_key" ON "Chat"("senderId", "receiverId", "motorcycleId");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_senderId_receiverId_realEstateId_key" ON "Chat"("senderId", "receiverId", "realEstateId");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_senderId_receiverId_marketplaceId_key" ON "Chat"("senderId", "receiverId", "marketplaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_senderId_receiverId_farmequipmentId_key" ON "Chat"("senderId", "receiverId", "farmequipmentId");

-- CreateIndex
CREATE INDEX "Message_chatId_idx" ON "Message"("chatId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_receiverId_read_idx" ON "Message"("receiverId", "read");

-- CreateIndex
CREATE INDEX "Message_timestamp_idx" ON "Message"("timestamp");

-- CreateIndex
CREATE INDEX "Message_chatId_timestamp_idx" ON "Message"("chatId", "timestamp");

-- CreateIndex
CREATE INDEX "CustomerSupportTicket_status_idx" ON "CustomerSupportTicket"("status");

-- CreateIndex
CREATE INDEX "CustomerSupportTicket_priority_idx" ON "CustomerSupportTicket"("priority");

-- CreateIndex
CREATE INDEX "CustomerSupportTicket_createdAt_idx" ON "CustomerSupportTicket"("createdAt");

-- CreateIndex
CREATE INDEX "TicketMessage_ticketId_idx" ON "TicketMessage"("ticketId");

-- CreateIndex
CREATE INDEX "TicketMessage_createdAt_idx" ON "TicketMessage"("createdAt");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_category_subCategory_idx" ON "Subscription"("category", "subCategory");

-- CreateIndex
CREATE INDEX "Subscription_isActive_idx" ON "Subscription"("isActive");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE INDEX "Subscription_region_idx" ON "Subscription"("region");

-- CreateIndex
CREATE INDEX "Subscription_createdAt_idx" ON "Subscription"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_category_idx" ON "Notification"("category");

-- CreateIndex
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");

-- CreateIndex
CREATE INDEX "SearchLog_userId_idx" ON "SearchLog"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_transactionId_idx" ON "Payment"("transactionId");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

-- CreateIndex
CREATE INDEX "Payment_marketplaceId_idx" ON "Payment"("marketplaceId");

-- CreateIndex
CREATE INDEX "Payment_realEstateId_idx" ON "Payment"("realEstateId");

-- CreateIndex
CREATE INDEX "Payment_boatId_idx" ON "Payment"("boatId");

-- CreateIndex
CREATE INDEX "Payment_carId_idx" ON "Payment"("carId");

-- CreateIndex
CREATE INDEX "Payment_motorcycleId_idx" ON "Payment"("motorcycleId");

-- CreateIndex
CREATE INDEX "Payment_farmequipmentId_idx" ON "Payment"("farmequipmentId");

-- CreateIndex
CREATE INDEX "Payment_jobId_idx" ON "Payment"("jobId");

-- CreateIndex
CREATE INDEX "Payment_marketplaceFeeId_idx" ON "Payment"("marketplaceFeeId");

-- CreateIndex
CREATE INDEX "Payment_realEstateFeeId_idx" ON "Payment"("realEstateFeeId");

-- CreateIndex
CREATE INDEX "Payment_boatFeeId_idx" ON "Payment"("boatFeeId");

-- CreateIndex
CREATE INDEX "Payment_carFeeId_idx" ON "Payment"("carFeeId");

-- CreateIndex
CREATE INDEX "Payment_motorcycleFeeId_idx" ON "Payment"("motorcycleFeeId");

-- CreateIndex
CREATE INDEX "Payment_equipmentFeeId_idx" ON "Payment"("equipmentFeeId");

-- CreateIndex
CREATE INDEX "Payment_planConfigId_idx" ON "Payment"("planConfigId");

-- CreateIndex
CREATE INDEX "FeeChangeLog_feeConfigId_idx" ON "FeeChangeLog"("feeConfigId");

-- CreateIndex
CREATE INDEX "_MarketplaceToMessage_B_index" ON "_MarketplaceToMessage"("B");

-- CreateIndex
CREATE INDEX "_UserAgencies_B_index" ON "_UserAgencies"("B");

-- CreateIndex
CREATE INDEX "_ChatToJob_B_index" ON "_ChatToJob"("B");

-- CreateIndex
CREATE INDEX "_MessageToRealEstate_B_index" ON "_MessageToRealEstate"("B");

-- AddForeignKey
ALTER TABLE "Cookie" ADD CONSTRAINT "Cookie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Marketplace" ADD CONSTRAINT "Marketplace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Marketplace" ADD CONSTRAINT "Marketplace_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "MarketplaceFee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Marketplace" ADD CONSTRAINT "Marketplace_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealEstate" ADD CONSTRAINT "RealEstate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealEstate" ADD CONSTRAINT "RealEstate_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "RealEstateFee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealEstate" ADD CONSTRAINT "RealEstate_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boat" ADD CONSTRAINT "Boat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boat" ADD CONSTRAINT "Boat_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "BoatFee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boat" ADD CONSTRAINT "Boat_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "CarFee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Motorcycle" ADD CONSTRAINT "Motorcycle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Motorcycle" ADD CONSTRAINT "Motorcycle_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "MotorcycleFee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Motorcycle" ADD CONSTRAINT "Motorcycle_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Farmequipment" ADD CONSTRAINT "Farmequipment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Farmequipment" ADD CONSTRAINT "Farmequipment_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "EquipmentFeeConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Farmequipment" ADD CONSTRAINT "Farmequipment_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "EquipmentFeeConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advertisement" ADD CONSTRAINT "Advertisement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_boatId_fkey" FOREIGN KEY ("boatId") REFERENCES "Boat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_marketplaceId_fkey" FOREIGN KEY ("marketplaceId") REFERENCES "Marketplace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_motorcycleId_fkey" FOREIGN KEY ("motorcycleId") REFERENCES "Motorcycle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_realEstateId_fkey" FOREIGN KEY ("realEstateId") REFERENCES "RealEstate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_farmequipmentId_fkey" FOREIGN KEY ("farmequipmentId") REFERENCES "Farmequipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketMessage" ADD CONSTRAINT "TicketMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "CustomerSupportTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchLog" ADD CONSTRAINT "SearchLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_marketplaceId_fkey" FOREIGN KEY ("marketplaceId") REFERENCES "Marketplace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_realEstateId_fkey" FOREIGN KEY ("realEstateId") REFERENCES "RealEstate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_boatId_fkey" FOREIGN KEY ("boatId") REFERENCES "Boat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_motorcycleId_fkey" FOREIGN KEY ("motorcycleId") REFERENCES "Motorcycle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_farmequipmentId_fkey" FOREIGN KEY ("farmequipmentId") REFERENCES "Farmequipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_marketplaceFeeId_fkey" FOREIGN KEY ("marketplaceFeeId") REFERENCES "MarketplaceFee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_realEstateFeeId_fkey" FOREIGN KEY ("realEstateFeeId") REFERENCES "RealEstateFee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_boatFeeId_fkey" FOREIGN KEY ("boatFeeId") REFERENCES "BoatFee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_carFeeId_fkey" FOREIGN KEY ("carFeeId") REFERENCES "CarFee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_motorcycleFeeId_fkey" FOREIGN KEY ("motorcycleFeeId") REFERENCES "MotorcycleFee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_equipmentFeeId_fkey" FOREIGN KEY ("equipmentFeeId") REFERENCES "EquipmentFeeConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_planConfigId_fkey" FOREIGN KEY ("planConfigId") REFERENCES "SubPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeChangeLog" ADD CONSTRAINT "FeeChangeLog_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeChangeLog" ADD CONSTRAINT "log_sys_config" FOREIGN KEY ("feeConfigId") REFERENCES "SystemConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeChangeLog" ADD CONSTRAINT "log_sub_plan" FOREIGN KEY ("feeConfigId") REFERENCES "SubPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeChangeLog" ADD CONSTRAINT "log_market_fee" FOREIGN KEY ("feeConfigId") REFERENCES "MarketplaceFee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeChangeLog" ADD CONSTRAINT "log_estate_fee" FOREIGN KEY ("feeConfigId") REFERENCES "RealEstateFee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeChangeLog" ADD CONSTRAINT "log_car_fee" FOREIGN KEY ("feeConfigId") REFERENCES "CarFee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeChangeLog" ADD CONSTRAINT "log_motorcycle_fee" FOREIGN KEY ("feeConfigId") REFERENCES "MotorcycleFee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeChangeLog" ADD CONSTRAINT "log_boat_fee" FOREIGN KEY ("feeConfigId") REFERENCES "BoatFee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeChangeLog" ADD CONSTRAINT "log_equip_fee" FOREIGN KEY ("feeConfigId") REFERENCES "EquipmentFeeConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MarketplaceToMessage" ADD CONSTRAINT "_MarketplaceToMessage_A_fkey" FOREIGN KEY ("A") REFERENCES "Marketplace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MarketplaceToMessage" ADD CONSTRAINT "_MarketplaceToMessage_B_fkey" FOREIGN KEY ("B") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserAgencies" ADD CONSTRAINT "_UserAgencies_A_fkey" FOREIGN KEY ("A") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserAgencies" ADD CONSTRAINT "_UserAgencies_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToJob" ADD CONSTRAINT "_ChatToJob_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToJob" ADD CONSTRAINT "_ChatToJob_B_fkey" FOREIGN KEY ("B") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessageToRealEstate" ADD CONSTRAINT "_MessageToRealEstate_A_fkey" FOREIGN KEY ("A") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessageToRealEstate" ADD CONSTRAINT "_MessageToRealEstate_B_fkey" FOREIGN KEY ("B") REFERENCES "RealEstate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
