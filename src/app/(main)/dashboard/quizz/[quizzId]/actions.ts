"use server";

import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const playQuizz = async (quizzId: string) => {
  const session = await getAuthSession();

  if (!session) throw new Error("Unauthorize");

  const addedToRecently = await prisma.quizz.findFirst({
    where: { id: quizzId },
    include: {
      recentlyStartedQuizz: {
        where: {
          userId: session.user.id,
        },
      },
    },
  });

  const isAddedToRecently = !!addedToRecently?.recentlyStartedQuizz.length!!;

  if (!isAddedToRecently) {
    await prisma.recentlyStartedQuizz.create({
      data: {
        userId: session.user.id,
        quizzId,
        startedAt: new Date(),
      },
    });
  } else {
    await prisma.recentlyStartedQuizz.updateMany({
      where: {
        AND: [{ quizzId }, { userId: session.user.id }],
      },
      data: {
        startedAt: new Date(),
      },
    });
  }

  return { success: true };
};
