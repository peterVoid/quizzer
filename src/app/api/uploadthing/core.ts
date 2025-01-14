import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const uploadRouter = {
  singleImage: f({
    image: { maxFileSize: "2MB", maxFileCount: 1, minFileCount: 1 },
  })
    .middleware(async (req) => {
      const user = await getToken(req);

      if (!user)
        throw new Error("Unauthorize: Please login to upload a profile image");

      return { userId: user.id };
    })
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
