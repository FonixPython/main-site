/*
  Warnings:

  - Added the required column `mimeType` to the `uploads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `uploads` ADD COLUMN `mimeType` TEXT NOT NULL;
