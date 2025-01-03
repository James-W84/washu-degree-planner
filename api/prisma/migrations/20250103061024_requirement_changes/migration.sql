/*
  Warnings:

  - You are about to drop the column `courseRequirementsId` on the `Degree` table. All the data in the column will be lost.
  - You are about to drop the column `courseRequirementsId` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the column `courseRequirementsId` on the `School` table. All the data in the column will be lost.
  - You are about to drop the `CourseRequirement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Requirement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_courseCourseReqs` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CourseRequirementGroupType" AS ENUM ('SINGLE', 'AND', 'OR');

-- DropForeignKey
ALTER TABLE "Degree" DROP CONSTRAINT "Degree_courseRequirementsId_fkey";

-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_courseRequirementsId_fkey";

-- DropForeignKey
ALTER TABLE "Requirement" DROP CONSTRAINT "Requirement_degreeId_fkey";

-- DropForeignKey
ALTER TABLE "Requirement" DROP CONSTRAINT "Requirement_programId_fkey";

-- DropForeignKey
ALTER TABLE "Requirement" DROP CONSTRAINT "Requirement_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Requirement" DROP CONSTRAINT "Requirement_tagId_fkey";

-- DropForeignKey
ALTER TABLE "School" DROP CONSTRAINT "School_courseRequirementsId_fkey";

-- DropForeignKey
ALTER TABLE "_courseCourseReqs" DROP CONSTRAINT "_courseCourseReqs_A_fkey";

-- DropForeignKey
ALTER TABLE "_courseCourseReqs" DROP CONSTRAINT "_courseCourseReqs_B_fkey";

-- DropIndex
DROP INDEX "Degree_courseRequirementsId_key";

-- DropIndex
DROP INDEX "Program_courseRequirementsId_key";

-- DropIndex
DROP INDEX "School_courseRequirementsId_key";

-- AlterTable
ALTER TABLE "Degree" DROP COLUMN "courseRequirementsId";

-- AlterTable
ALTER TABLE "Program" DROP COLUMN "courseRequirementsId";

-- AlterTable
ALTER TABLE "School" DROP COLUMN "courseRequirementsId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "secondaryMajorId" INTEGER;

-- DropTable
DROP TABLE "CourseRequirement";

-- DropTable
DROP TABLE "Requirement";

-- DropTable
DROP TABLE "_courseCourseReqs";

-- CreateTable
CREATE TABLE "GroupRequirement" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "tagId" INTEGER,
    "programId" INTEGER,
    "degreeId" INTEGER,
    "schoolId" INTEGER,

    CONSTRAINT "GroupRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseRequirementGroup" (
    "id" SERIAL NOT NULL,
    "type" "CourseRequirementGroupType" NOT NULL,
    "programId" INTEGER,
    "degreeId" INTEGER,
    "schoolId" INTEGER,

    CONSTRAINT "CourseRequirementGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_nestedCourseReqGroups" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_nestedCourseReqGroups_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_courseCourseReqGroups" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_courseCourseReqGroups_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CourseToGroupRequirement" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CourseToGroupRequirement_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_nestedCourseReqGroups_B_index" ON "_nestedCourseReqGroups"("B");

-- CreateIndex
CREATE INDEX "_courseCourseReqGroups_B_index" ON "_courseCourseReqGroups"("B");

-- CreateIndex
CREATE INDEX "_CourseToGroupRequirement_B_index" ON "_CourseToGroupRequirement"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_secondaryMajorId_fkey" FOREIGN KEY ("secondaryMajorId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupRequirement" ADD CONSTRAINT "GroupRequirement_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupRequirement" ADD CONSTRAINT "GroupRequirement_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupRequirement" ADD CONSTRAINT "GroupRequirement_degreeId_fkey" FOREIGN KEY ("degreeId") REFERENCES "Degree"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupRequirement" ADD CONSTRAINT "GroupRequirement_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRequirementGroup" ADD CONSTRAINT "CourseRequirementGroup_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRequirementGroup" ADD CONSTRAINT "CourseRequirementGroup_degreeId_fkey" FOREIGN KEY ("degreeId") REFERENCES "Degree"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRequirementGroup" ADD CONSTRAINT "CourseRequirementGroup_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_nestedCourseReqGroups" ADD CONSTRAINT "_nestedCourseReqGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "CourseRequirementGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_nestedCourseReqGroups" ADD CONSTRAINT "_nestedCourseReqGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "CourseRequirementGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_courseCourseReqGroups" ADD CONSTRAINT "_courseCourseReqGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_courseCourseReqGroups" ADD CONSTRAINT "_courseCourseReqGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "CourseRequirementGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToGroupRequirement" ADD CONSTRAINT "_CourseToGroupRequirement_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToGroupRequirement" ADD CONSTRAINT "_CourseToGroupRequirement_B_fkey" FOREIGN KEY ("B") REFERENCES "GroupRequirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
