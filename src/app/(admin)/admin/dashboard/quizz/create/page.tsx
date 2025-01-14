import { Metadata } from "next";
import { QuizzForm } from "./QuizzForm";

export const metadata: Metadata = {
  title: "Create Quizz",
};

export default function Page() {
  return (
    <div className="min-w-[900px] max-w-6xl space-y-20">
      <h1 className="text-2xl font-bold underline md:text-5xl">Create Quizz</h1>
      <div className="space-y-3">
        <QuizzForm />
      </div>
    </div>
  );
}
