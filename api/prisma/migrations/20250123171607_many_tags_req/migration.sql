/*
  Warnings:

  - You are about to drop the column `tagId` on the `TagRequirement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TagRequirement" DROP CONSTRAINT "TagRequirement_tagId_fkey";

-- AlterTable
ALTER TABLE "TagRequirement" DROP COLUMN "tagId";

-- CreateTable
CREATE TABLE "_TagToTagRequirement" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TagToTagRequirement_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TagToTagRequirement_B_index" ON "_TagToTagRequirement"("B");

-- AddForeignKey
ALTER TABLE "_TagToTagRequirement" ADD CONSTRAINT "_TagToTagRequirement_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToTagRequirement" ADD CONSTRAINT "_TagToTagRequirement_B_fkey" FOREIGN KEY ("B") REFERENCES "TagRequirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
