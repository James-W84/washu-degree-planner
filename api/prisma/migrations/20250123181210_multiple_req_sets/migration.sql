/*
  Warnings:

  - You are about to drop the column `requirementSetId` on the `School` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "School" DROP CONSTRAINT "School_requirementSetId_fkey";

-- DropIndex
DROP INDEX "School_requirementSetId_key";

-- AlterTable
ALTER TABLE "RequirementSet" ADD COLUMN     "schoolId" INTEGER;

-- AlterTable
ALTER TABLE "School" DROP COLUMN "requirementSetId";

-- AddForeignKey
ALTER TABLE "RequirementSet" ADD CONSTRAINT "RequirementSet_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;
