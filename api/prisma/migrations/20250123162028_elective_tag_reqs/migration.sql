/*
  Warnings:

  - You are about to drop the `AttributeRequirement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AttributeRequirementToCourse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AttributeRequirement" DROP CONSTRAINT "AttributeRequirement_requirementSetId_fkey";

-- DropForeignKey
ALTER TABLE "AttributeRequirement" DROP CONSTRAINT "AttributeRequirement_tagId_fkey";

-- DropForeignKey
ALTER TABLE "_AttributeRequirementToCourse" DROP CONSTRAINT "_AttributeRequirementToCourse_A_fkey";

-- DropForeignKey
ALTER TABLE "_AttributeRequirementToCourse" DROP CONSTRAINT "_AttributeRequirementToCourse_B_fkey";

-- DropTable
DROP TABLE "AttributeRequirement";

-- DropTable
DROP TABLE "_AttributeRequirementToCourse";

-- CreateTable
CREATE TABLE "ElectiveRequirement" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "requirementSetId" INTEGER NOT NULL,

    CONSTRAINT "ElectiveRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagRequirement" (
    "id" SERIAL NOT NULL,
    "credits" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "requirementSetId" INTEGER NOT NULL,

    CONSTRAINT "TagRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CourseToElectiveRequirement" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CourseToElectiveRequirement_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CourseToElectiveRequirement_B_index" ON "_CourseToElectiveRequirement"("B");

-- AddForeignKey
ALTER TABLE "ElectiveRequirement" ADD CONSTRAINT "ElectiveRequirement_requirementSetId_fkey" FOREIGN KEY ("requirementSetId") REFERENCES "RequirementSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagRequirement" ADD CONSTRAINT "TagRequirement_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagRequirement" ADD CONSTRAINT "TagRequirement_requirementSetId_fkey" FOREIGN KEY ("requirementSetId") REFERENCES "RequirementSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToElectiveRequirement" ADD CONSTRAINT "_CourseToElectiveRequirement_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToElectiveRequirement" ADD CONSTRAINT "_CourseToElectiveRequirement_B_fkey" FOREIGN KEY ("B") REFERENCES "ElectiveRequirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
