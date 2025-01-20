/*
  Warnings:

  - A unique constraint covering the columns `[quizzId,userId]` on the table `recentlyStartedQuizz` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "recentlyStartedQuizz_quizzId_userId_key" ON "recentlyStartedQuizz"("quizzId", "userId");
