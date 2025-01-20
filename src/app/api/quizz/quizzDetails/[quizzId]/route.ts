import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QuizzDataInclude } from "@/lib/types";

export async function GET(req: Request, { params }: { params: Promise<{ quizzId: string }> }) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return Response.json({ error: "Unauthorize" }, { status: 402 })
    }

    const { quizzId } = await params;

    const quizz = await prisma.quizz.findUnique({
      where: { id: quizzId },
      include: QuizzDataInclude
    })

    if (!quizz) {
      return Response.json({ error: "Quizz not found" }, { status: 404 })
    }

    return Response.json(quizz, { status: 200 })

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
