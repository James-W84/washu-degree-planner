/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `School` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "School_title_key";

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "School_name_key" ON "School"("name");
