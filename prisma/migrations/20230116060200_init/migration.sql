-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userName` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `forgetToken` VARCHAR(191) NULL,
    `expiryTime` VARCHAR(191) NULL,
    `successorId` VARCHAR(191) NULL,

    UNIQUE INDEX `user_userName_key`(`userName`),
    UNIQUE INDEX `user_successorId_key`(`successorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_successorId_fkey` FOREIGN KEY (`successorId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
