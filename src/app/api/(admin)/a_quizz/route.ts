import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QuizzDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return Response.json({ error: "Unauthorize" }, { status: 402 });
    }
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "10");
    const sortByTile = url.searchParams.get("sortByTitle") as "asc" | "desc";
    const skip = (page - 1) * limit;

    const quizz = await prisma.quizz.findMany({
      orderBy: { title: sortByTile },
      skip,
      take: limit,
      include: QuizzDataInclude,
    });

    const total = await prisma.quizz.count();

    return Response.json({ quizz, total }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
