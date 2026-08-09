/*
  Warnings:

  - You are about to alter the column `dateOfCreation` on the `gallery` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Added the required column `lowresImageId` to the `gallery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `gallery` ADD COLUMN `lowresImageId` TEXT NOT NULL,
    MODIFY `dateOfCreation` TIMESTAMP NOT NULL;
