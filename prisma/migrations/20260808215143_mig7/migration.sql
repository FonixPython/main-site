-- CreateTable
CREATE TABLE `gallery` (
    `id` VARCHAR(255) NOT NULL DEFAULT (uuid()),
    `imageId` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `exifData` TEXT NOT NULL,
    `tags` TEXT NOT NULL,
    `clicks` INTEGER NOT NULL,
    `downloads` INTEGER NOT NULL,
    `dateOfCreation` TIMESTAMP NOT NULL,
    `dateOfUpload` TIMESTAMP(0) NOT NULL DEFAULT (curtime()),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
