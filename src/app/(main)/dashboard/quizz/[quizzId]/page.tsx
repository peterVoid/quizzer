import { Metadata } from "next";
import { QuizzDetailCard } from "./QuizzDetailsCard";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{ quizzId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { quizzId } = await params;

  const quizz = await prisma.quizz.findUnique({
    where: { id: quizzId },
    select: { title: true },
  });

  return {
    title: `${quizz?.title}`,
  };
}

export default async function Page({ params }: PageProps) {
  const { quizzId } = await params;

  return (
    <div className="mx-auto max-w-6xl p-4">
      {quizzId && <QuizzDetailCard quizzId={quizzId} />}
    </div>
  );
}
