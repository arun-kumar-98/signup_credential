/*
  Warnings:

  - You are about to alter the column `expiryTime` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `expiryTime` DATETIME(3) NULL;
