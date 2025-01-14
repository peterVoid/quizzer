-- CreateEnum
CREATE TYPE "UserInteresting" AS ENUM ('SCIENCE', 'HISTORY', 'PROGRAMMING');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "onboarded" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "user_interests" (
    "id" TEXT NOT NULL,
    "interest" "UserInteresting" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_interests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_interests_userId_interest_key" ON "user_interests"("userId", "interest");

-- AddForeignKey
ALTER TABLE "user_interests" ADD CONSTRAINT "user_interests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
