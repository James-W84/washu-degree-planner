/*
  Warnings:

  - You are about to drop the column `degreeId` on the `CourseRequirementGroup` table. All the data in the column will be lost.
  - You are about to drop the column `programId` on the `CourseRequirementGroup` table. All the data in the column will be lost.
  - You are about to drop the column `schoolId` on the `CourseRequirementGroup` table. All the data in the column will be lost.
  - You are about to drop the column `degreeId` on the `GroupRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `programId` on the `GroupRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `schoolId` on the `GroupRequirement` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[requirementSetId]` on the table `Degree` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[requirementSetId]` on the table `Program` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[requirementSetId]` on the table `School` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `requirementSetId` to the `CourseRequirementGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requirementSetId` to the `GroupRequirement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CourseRequirementGroup" DROP CONSTRAINT "CourseRequirementGroup_degreeId_fkey";

-- DropForeignKey
ALTER TABLE "CourseRequirementGroup" DROP CONSTRAINT "CourseRequirementGroup_programId_fkey";

-- DropForeignKey
ALTER TABLE "CourseRequirementGroup" DROP CONSTRAINT "CourseRequirementGroup_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "GroupRequirement" DROP CONSTRAINT "GroupRequirement_degreeId_fkey";

-- DropForeignKey
ALTER TABLE "GroupRequirement" DROP CONSTRAINT "GroupRequirement_programId_fkey";

-- DropForeignKey
ALTER TABLE "GroupRequirement" DROP CONSTRAINT "GroupRequirement_schoolId_fkey";

-- AlterTable
ALTER TABLE "CourseRequirementGroup" DROP COLUMN "degreeId",
DROP COLUMN "programId",
DROP COLUMN "schoolId",
ADD COLUMN     "requirementSetId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Degree" ADD COLUMN     "requirementSetId" INTEGER;

-- AlterTable
ALTER TABLE "GroupRequirement" DROP COLUMN "degreeId",
DROP COLUMN "programId",
DROP COLUMN "schoolId",
ADD COLUMN     "requirementSetId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "requirementSetId" INTEGER;

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "requirementSetId" INTEGER;

-- CreateTable
CREATE TABLE "RequirementSet" (
    "id" SERIAL NOT NULL,
    "startYear" INTEGER NOT NULL,

    CONSTRAINT "RequirementSet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Degree_requirementSetId_key" ON "Degree"("requirementSetId");

-- CreateIndex
CREATE UNIQUE INDEX "Program_requirementSetId_key" ON "Program"("requirementSetId");

-- CreateIndex
CREATE UNIQUE INDEX "School_requirementSetId_key" ON "School"("requirementSetId");

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_requirementSetId_fkey" FOREIGN KEY ("requirementSetId") REFERENCES "RequirementSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Degree" ADD CONSTRAINT "Degree_requirementSetId_fkey" FOREIGN KEY ("requirementSetId") REFERENCES "RequirementSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_requirementSetId_fkey" FOREIGN KEY ("requirementSetId") REFERENCES "RequirementSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupRequirement" ADD CONSTRAINT "GroupRequirement_requirementSetId_fkey" FOREIGN KEY ("requirementSetId") REFERENCES "RequirementSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRequirementGroup" ADD CONSTRAINT "CourseRequirementGroup_requirementSetId_fkey" FOREIGN KEY ("requirementSetId") REFERENCES "RequirementSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
