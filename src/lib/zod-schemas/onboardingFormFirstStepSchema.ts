import { z } from "zod";

export const onboardingFormFirstStepSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(30, { message: "Username cannot exceed 30 characters long" })
    .refine((username) => /^[a-zA-Z0-9_]+$/.test(username), {
      message: "Username can only have letter, number, underscore",
    }),
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(30, { message: "Name cannot exceed 30 characters long" }),
});

export type onboardingFormFirstStepSchemaType = z.infer<
  typeof onboardingFormFirstStepSchema
>;
