/*
  Warnings:

  - A unique constraint covering the columns `[schoolId,degreeId,programId,startYear]` on the table `RequirementSet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RequirementSet_schoolId_degreeId_programId_startYear_key" ON "RequirementSet"("schoolId", "degreeId", "programId", "startYear");
