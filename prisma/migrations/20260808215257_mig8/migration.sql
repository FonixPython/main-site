/*
  Warnings:

  - You are about to alter the column `dateOfCreation` on the `gallery` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `gallery` ADD COLUMN `public` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `dateOfCreation` TIMESTAMP NOT NULL;
