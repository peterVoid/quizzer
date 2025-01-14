"use server";

import { prisma } from "@/lib/prisma";

export const deleteQuizz = async (quizzId: string) => {
  try {
    const findQuizz = await prisma.quizz.findUnique({
      where: { id: quizzId },
    });

    if (!findQuizz) throw new Error("Quizz not found");

    await prisma.quizz.delete({
      where: { id: quizzId },
    });

    return { message: "Successfully deleted quizz" };
  } catch (error) {
    console.error(error);
  }
};
