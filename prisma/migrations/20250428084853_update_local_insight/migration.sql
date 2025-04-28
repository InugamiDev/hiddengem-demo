/*
  Warnings:

  - You are about to drop the column `bestTime` on the `LocalInsight` table. All the data in the column will be lost.
  - You are about to drop the column `coordinates` on the `LocalInsight` table. All the data in the column will be lost.
  - You are about to drop the column `insiderTip` on the `LocalInsight` table. All the data in the column will be lost.
  - Added the required column `country` to the `LocalInsight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `LocalInsight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `LocalInsight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LocalInsight" DROP COLUMN "bestTime",
DROP COLUMN "coordinates",
DROP COLUMN "insiderTip",
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "area" DROP NOT NULL,
ALTER COLUMN "priceRange" DROP NOT NULL;
