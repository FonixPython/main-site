/*
  Warnings:

  - You are about to alter the column `dateOfCreation` on the `gallery` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `gallery` MODIFY `clicks` INTEGER NOT NULL DEFAULT 0,
    MODIFY `downloads` INTEGER NOT NULL DEFAULT 0,
    MODIFY `dateOfCreation` TIMESTAMP NOT NULL;
