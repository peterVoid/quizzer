import { Metadata } from "next";
import { QuizzForm } from "../../create/QuizzForm";
import { prisma } from "@/lib/prisma";
import { QuizzDataInclude } from "@/lib/types";

export const metadata: Metadata = {
  title: "Edit Quizz",
};

export default async function Page({
  params,
}: {
  params: Promise<{ quizzId: string }>;
}) {
  const { quizzId } = await params;

  let quizzData = undefined;

  try {
    quizzData = await prisma.quizz.findUnique({
      where: { id: quizzId },
      include: QuizzDataInclude,
    });
  } catch (error) {
    console.error(error);
  }

  if (!quizzData) return;

  return (
    <div className="min-w-[900px] max-w-6xl space-y-20">
      <h1 className="text-2xl font-bold underline md:text-5xl">Edit Quizz</h1>
      <div className="space-y-3">
        <QuizzForm quizzData={quizzData} />
      </div>
    </div>
  );
}
