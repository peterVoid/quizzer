/*
  Warnings:

  - A unique constraint covering the columns `[provider,user_id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_user_id_key" ON "accounts"("provider", "user_id");
