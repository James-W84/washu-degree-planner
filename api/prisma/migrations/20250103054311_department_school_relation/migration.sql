/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `School` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `schoolId` to the `Department` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "schoolId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "School_title_key" ON "School"("title");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
