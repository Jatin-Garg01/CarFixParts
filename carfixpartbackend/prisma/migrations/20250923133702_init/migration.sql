/*
  Warnings:

  - You are about to drop the column `price` on the `Part` table. All the data in the column will be lost.
  - Added the required column `sellingPrice` to the `Part` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Part" DROP COLUMN "price",
ADD COLUMN     "purchasedPrice" DOUBLE PRECISION,
ADD COLUMN     "sellingPrice" DOUBLE PRECISION NOT NULL;
