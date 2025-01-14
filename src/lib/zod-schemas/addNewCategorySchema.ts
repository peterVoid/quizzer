import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(15, { message: "Name must be less than 15 characters long" }),
});

export type categorySchemaType = z.infer<typeof categorySchema>;
