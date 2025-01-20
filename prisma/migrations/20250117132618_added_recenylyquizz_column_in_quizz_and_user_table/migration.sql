-- AlterTable
ALTER TABLE "quizz" ADD COLUMN     "recentlyAddedId" TEXT;

-- AddForeignKey
ALTER TABLE "quizz" ADD CONSTRAINT "quizz_recentlyAddedId_fkey" FOREIGN KEY ("recentlyAddedId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
