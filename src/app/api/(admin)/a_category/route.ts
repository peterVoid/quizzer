import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return Response.json({ error: "Unauthorize" }, { status: 401 });
    }

    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const total = await prisma.category.count();

    return Response.json({ categories, total }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
