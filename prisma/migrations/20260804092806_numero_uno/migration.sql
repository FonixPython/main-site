-- CreateTable
CREATE TABLE `sessions` (
    `token` VARCHAR(255) NOT NULL,
    `userAgent` TEXT NOT NULL,
    `generationDate` TIMESTAMP(0) NOT NULL DEFAULT (curtime()),

    PRIMARY KEY (`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `images` (
    `id` VARCHAR(255) NOT NULL DEFAULT (uuid()),
    `filename` TEXT NOT NULL,
    `alt` TEXT NOT NULL,
    `dateOfCreation` TIMESTAMP(0) NOT NULL DEFAULT (curtime()),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` TEXT NOT NULL,
    `imageId` TEXT NOT NULL,
    `shortDescription` TEXT NOT NULL,
    `github` TEXT NOT NULL,
    `dateOfCreation` TIMESTAMP(0) NOT NULL DEFAULT (curtime()),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
