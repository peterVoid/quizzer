import { Metadata } from "next";
import { AddNewQuizzButton } from "./AddNewQuizzButton";
import { QuizzTable } from "./QuizzTable";

export const metadata: Metadata = {
  title: "Quizz",
};

export default function Page() {
  return (
    <div className="min-w-[900px] max-w-6xl space-y-20">
      <h1 className="text-2xl font-bold underline md:text-5xl">Quizz</h1>
      <div className="space-y-3">
        <AddNewQuizzButton />
        <QuizzTable />
      </div>
    </div>
  );
}
