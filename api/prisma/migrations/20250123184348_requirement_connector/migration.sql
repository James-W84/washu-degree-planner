/*
  Warnings:

  - You are about to drop the column `requirementSetId` on the `Degree` table. All the data in the column will be lost.
  - You are about to drop the column `degreeId` on the `RequirementSet` table. All the data in the column will be lost.
  - You are about to drop the column `programId` on the `RequirementSet` table. All the data in the column will be lost.
  - You are about to drop the column `schoolId` on the `RequirementSet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[requirementConnectorId]` on the table `Degree` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[requirementConnectorId]` on the table `Program` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[requirementConnectorId,startYear]` on the table `RequirementSet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[requirementConnectorId]` on the table `School` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `requirementConnectorId` to the `Degree` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requirementConnectorId` to the `Program` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requirementConnectorId` to the `RequirementSet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RequirementSet" DROP CONSTRAINT "RequirementSet_degreeId_fkey";

-- DropForeignKey
ALTER TABLE "RequirementSet" DROP CONSTRAINT "RequirementSet_programId_fkey";

-- DropForeignKey
ALTER TABLE "RequirementSet" DROP CONSTRAINT "RequirementSet_schoolId_fkey";

-- DropIndex
DROP INDEX "Degree_requirementSetId_key";

-- DropIndex
DROP INDEX "RequirementSet_schoolId_degreeId_programId_startYear_key";

-- AlterTable
ALTER TABLE "Degree" DROP COLUMN "requirementSetId",
ADD COLUMN     "requirementConnectorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "requirementConnectorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RequirementSet" DROP COLUMN "degreeId",
DROP COLUMN "programId",
DROP COLUMN "schoolId",
ADD COLUMN     "requirementConnectorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "requirementConnectorId" INTEGER;

-- CreateTable
CREATE TABLE "RequirementConnector" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "RequirementConnector_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Degree_requirementConnectorId_key" ON "Degree"("requirementConnectorId");

-- CreateIndex
CREATE UNIQUE INDEX "Program_requirementConnectorId_key" ON "Program"("requirementConnectorId");

-- CreateIndex
CREATE UNIQUE INDEX "RequirementSet_requirementConnectorId_startYear_key" ON "RequirementSet"("requirementConnectorId", "startYear");

-- CreateIndex
CREATE UNIQUE INDEX "School_requirementConnectorId_key" ON "School"("requirementConnectorId");

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_requirementConnectorId_fkey" FOREIGN KEY ("requirementConnectorId") REFERENCES "RequirementConnector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Degree" ADD CONSTRAINT "Degree_requirementConnectorId_fkey" FOREIGN KEY ("requirementConnectorId") REFERENCES "RequirementConnector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_requirementConnectorId_fkey" FOREIGN KEY ("requirementConnectorId") REFERENCES "RequirementConnector"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequirementSet" ADD CONSTRAINT "RequirementSet_requirementConnectorId_fkey" FOREIGN KEY ("requirementConnectorId") REFERENCES "RequirementConnector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
