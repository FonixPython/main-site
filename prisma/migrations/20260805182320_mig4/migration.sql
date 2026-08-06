-- CreateTable
CREATE TABLE `uploads` (
    `id` VARCHAR(255) NOT NULL DEFAULT (uuid()),
    `filename` TEXT NOT NULL,
    `dateOfUpload` TIMESTAMP(0) NOT NULL DEFAULT (curtime()),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
