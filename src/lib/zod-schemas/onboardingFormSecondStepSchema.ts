import { UserInteresting } from "@prisma/client";
import { z } from "zod";

const validInterests = ["PROGRAMMING", "SCIENCE", "HISTORY"];

export const onboardingFormSecondStepSchema = z.object({
  interest: z
    .array(z.string())
    .nonempty({ message: "Please select at least 1 interest." })
    .refine(
      (interests) =>
        interests.every((interest) =>
          validInterests.includes(interest as UserInteresting),
        ),
      {
        message: "Invalid interest selected",
      },
    ),
});

export type onboardingFormSecondStepSchema = z.infer<
  typeof onboardingFormSecondStepSchema
>;
