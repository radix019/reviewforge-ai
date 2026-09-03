/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,fullName]` on the table `Repository` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Repository_ownerId_fullName_key" ON "Repository"("ownerId", "fullName");
