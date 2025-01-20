import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QuizzDataInclude, RecentlyQuizzInclude } from "@/lib/types";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return Response.json({ error: "Unauthorize" }, { status: 402 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const quizz = await prisma.recentlyStartedQuizz.findMany({
      where: { userId: session.user.id },
      include: RecentlyQuizzInclude,
      orderBy: { startedAt: "desc" },
    });

    return Response.json(quizz, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
