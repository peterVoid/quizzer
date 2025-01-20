import { z } from "zod";


export const onboardingFormSecondStepSchema = z.object({
  interest: z
    .array(z.string())
    .nonempty({ message: "Please select at least 1 interest." })
   });

export type onboardingFormSecondStepSchema = z.infer<
  typeof onboardingFormSecondStepSchema
>;
