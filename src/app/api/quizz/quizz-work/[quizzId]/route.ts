import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ quizzId: string }> },
) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return Response.json({ error: "Unauthorize" }, { status: 402 });
    }

    const { quizzId } = await params;

    const findQuizById = await prisma.quizz.findUnique({
      where: { id: quizzId },
    });

    if (!findQuizById) {
      return Response.json({ error: "Quizz not found" }, { status: 404 });
    }

    const quizzQuestionData = await prisma.quizz.findFirst({
      where: {
        id: quizzId,
      },
      include: {
        questions: true,
      },
    });

    return Response.json(quizzQuestionData, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
