/*
  Warnings:

  - You are about to drop the column `url` on the `PropertyImage` table. All the data in the column will be lost.
  - Added the required column `optimizedUrl` to the `PropertyImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnailUrl` to the `PropertyImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PropertyImage" DROP CONSTRAINT "PropertyImage_propertyId_fkey";

-- AlterTable
ALTER TABLE "PropertyImage" DROP COLUMN "url",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "optimizedUrl" TEXT NOT NULL,
ADD COLUMN     "thumbnailUrl" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PropertyImage" ADD CONSTRAINT "PropertyImage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
