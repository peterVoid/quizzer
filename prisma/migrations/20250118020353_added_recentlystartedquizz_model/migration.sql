/*
  Warnings:

  - You are about to drop the column `recentlyAddedId` on the `quizz` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "quizz" DROP CONSTRAINT "quizz_recentlyAddedId_fkey";

-- AlterTable
ALTER TABLE "quizz" DROP COLUMN "recentlyAddedId";

-- CreateTable
CREATE TABLE "recentlyStartedQuizz" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizzId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recentlyStartedQuizz_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recentlyStartedQuizz_userId_quizzId_idx" ON "recentlyStartedQuizz"("userId", "quizzId");

-- AddForeignKey
ALTER TABLE "recentlyStartedQuizz" ADD CONSTRAINT "recentlyStartedQuizz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recentlyStartedQuizz" ADD CONSTRAINT "recentlyStartedQuizz_quizzId_fkey" FOREIGN KEY ("quizzId") REFERENCES "quizz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
