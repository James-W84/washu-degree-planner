/*
  Warnings:

  - You are about to drop the column `requirementSetId` on the `Program` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Degree" DROP CONSTRAINT "Degree_requirementSetId_fkey";

-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_requirementSetId_fkey";

-- DropIndex
DROP INDEX "Program_requirementSetId_key";

-- AlterTable
ALTER TABLE "Program" DROP COLUMN "requirementSetId";

-- AlterTable
ALTER TABLE "RequirementSet" ADD COLUMN     "degreeId" INTEGER,
ADD COLUMN     "programId" INTEGER;

-- AddForeignKey
ALTER TABLE "RequirementSet" ADD CONSTRAINT "RequirementSet_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequirementSet" ADD CONSTRAINT "RequirementSet_degreeId_fkey" FOREIGN KEY ("degreeId") REFERENCES "Degree"("id") ON DELETE SET NULL ON UPDATE CASCADE;
