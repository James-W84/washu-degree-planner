/*
  Warnings:

  - You are about to drop the `GroupRequirement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CourseToGroupRequirement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GroupRequirement" DROP CONSTRAINT "GroupRequirement_requirementSetId_fkey";

-- DropForeignKey
ALTER TABLE "GroupRequirement" DROP CONSTRAINT "GroupRequirement_tagId_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToGroupRequirement" DROP CONSTRAINT "_CourseToGroupRequirement_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToGroupRequirement" DROP CONSTRAINT "_CourseToGroupRequirement_B_fkey";

-- DropTable
DROP TABLE "GroupRequirement";

-- DropTable
DROP TABLE "_CourseToGroupRequirement";

-- CreateTable
CREATE TABLE "AttributeRequirement" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "tagId" INTEGER,
    "requirementSetId" INTEGER NOT NULL,

    CONSTRAINT "AttributeRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AttributeRequirementToCourse" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AttributeRequirementToCourse_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AttributeRequirementToCourse_B_index" ON "_AttributeRequirementToCourse"("B");

-- AddForeignKey
ALTER TABLE "AttributeRequirement" ADD CONSTRAINT "AttributeRequirement_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeRequirement" ADD CONSTRAINT "AttributeRequirement_requirementSetId_fkey" FOREIGN KEY ("requirementSetId") REFERENCES "RequirementSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttributeRequirementToCourse" ADD CONSTRAINT "_AttributeRequirementToCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "AttributeRequirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttributeRequirementToCourse" ADD CONSTRAINT "_AttributeRequirementToCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
