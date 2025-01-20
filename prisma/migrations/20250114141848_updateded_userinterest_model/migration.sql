/*
  Warnings:

  - The `interest` column on the `user_interests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "user_interests" DROP COLUMN "interest",
ADD COLUMN     "interest" TEXT[];

-- DropEnum
DROP TYPE "UserInteresting";

-- CreateIndex
CREATE UNIQUE INDEX "user_interests_userId_interest_key" ON "user_interests"("userId", "interest");
