import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QuizzDataInclude } from "@/lib/types";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();

    if(!session) {
      return Response.json({message: "Unauthorize"}, {status: 402})
    }

    const getUserInterest = await prisma.userInterest.findFirst({
      where: {userId: session.user.id},
      select: {
        interest: true
      }
    });


    const quizzData = await prisma.quizz.findMany({
      where: {
        category: {
          OR: getUserInterest?.interest.map((interest) => ({
            name: interest
          }))
        } 
      },
      include: QuizzDataInclude
    })


  return Response.json(quizzData, {status: 200})

  } catch (error) {
   console.error(error);
    return Response.json({message: "Something went wrong"}, {status: 500});
  }
}
