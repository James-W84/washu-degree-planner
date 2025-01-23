-- DropForeignKey
ALTER TABLE "CourseRequirementGroup" DROP CONSTRAINT "CourseRequirementGroup_requirementSetId_fkey";

-- DropForeignKey
ALTER TABLE "ElectiveRequirement" DROP CONSTRAINT "ElectiveRequirement_requirementSetId_fkey";

-- DropForeignKey
ALTER TABLE "TagRequirement" DROP CONSTRAINT "TagRequirement_requirementSetId_fkey";

-- AddForeignKey
ALTER TABLE "ElectiveRequirement" ADD CONSTRAINT "ElectiveRequirement_requirementSetId_fkey" FOREIGN KEY ("requirementSetId") REFERENCES "RequirementSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagRequirement" ADD CONSTRAINT "TagRequirement_requirementSetId_fkey" FOREIGN KEY ("requirementSetId") REFERENCES "RequirementSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRequirementGroup" ADD CONSTRAINT "CourseRequirementGroup_requirementSetId_fkey" FOREIGN KEY ("requirementSetId") REFERENCES "RequirementSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
