/*
  Warnings:

  - Made the column `tagId` on table `AttributeRequirement` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AttributeRequirement" DROP CONSTRAINT "AttributeRequirement_tagId_fkey";

-- AlterTable
ALTER TABLE "AttributeRequirement" ALTER COLUMN "tagId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "AttributeRequirement" ADD CONSTRAINT "AttributeRequirement_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
