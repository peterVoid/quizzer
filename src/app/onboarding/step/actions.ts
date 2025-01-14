"use server";

import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const uploadProfileImage = async (imageUrl: string) => {
  const session = await getAuthSession();

  if (!session) throw new Error("Unauthorize");

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        image: imageUrl,
      },
    });

    return {
      success: true,
      message: "Upload success",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: {
        root: "An error occured. Please try again.",
      },
    };
  }
};
