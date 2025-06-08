/*
  Warnings:

  - A unique constraint covering the columns `[userEmail]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cart_userEmail_key" ON "Cart"("userEmail");
