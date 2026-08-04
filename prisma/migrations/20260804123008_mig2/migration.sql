/*
  Warnings:

  - You are about to drop the column `imageId` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `imageUrl` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `projects` DROP COLUMN `imageId`,
    ADD COLUMN `imageUrl` TEXT NOT NULL;

-- DropTable
DROP TABLE `images`;
