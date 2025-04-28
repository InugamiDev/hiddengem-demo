-- CreateTable
CREATE TABLE "TripPlan" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "destination" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "budget" TEXT NOT NULL,
    "interests" TEXT[],
    "accommodation" TEXT NOT NULL,
    "transportation" TEXT NOT NULL,
    "mealType" TEXT[],
    "activities" TEXT[],
    "localPreferences" JSONB,
    "vibeKeywords" TEXT[],
    "avoidTouristy" BOOLEAN NOT NULL DEFAULT true,
    "localAreas" TEXT[],
    "culturalInterests" TEXT[],
    "dietaryNeeds" TEXT[],
    "userId" TEXT,

    CONSTRAINT "TripPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalInsight" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "city" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "insiderTip" TEXT,
    "bestTime" TEXT,
    "priceRange" TEXT NOT NULL,
    "coordinates" JSONB,
    "tags" TEXT[],
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LocalInsight_pkey" PRIMARY KEY ("id")
);
