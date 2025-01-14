-- CreateTable
CREATE TABLE "quizz" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail" TEXT,
    "userId" TEXT,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quizz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizzQuestionAndOptions" (
    "id" TEXT NOT NULL,
    "questionTitle" TEXT NOT NULL,
    "questionOptions" JSONB NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "quizzId" TEXT NOT NULL,

    CONSTRAINT "quizzQuestionAndOptions_pkey" PRIMARY KEY ("id","quizzId")
);

-- AddForeignKey
ALTER TABLE "quizz" ADD CONSTRAINT "quizz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizz" ADD CONSTRAINT "quizz_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzQuestionAndOptions" ADD CONSTRAINT "quizzQuestionAndOptions_quizzId_fkey" FOREIGN KEY ("quizzId") REFERENCES "quizz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
