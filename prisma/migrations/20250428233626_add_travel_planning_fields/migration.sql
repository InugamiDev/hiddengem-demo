-- AlterTable
ALTER TABLE "TripPlan" ADD COLUMN     "emergencyContacts" JSONB,
ADD COLUMN     "packingChecklist" JSONB,
ADD COLUMN     "riskConcerns" TEXT[],
ADD COLUMN     "safetyNotes" TEXT,
ADD COLUMN     "travelStyle" TEXT[],
ADD COLUMN     "tripStage" INTEGER NOT NULL DEFAULT 1;
