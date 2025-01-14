import { z } from "zod";

export const onboardingFormFinalStepSchema = z.object({
  username: z.string().min(1),
  name: z.string().min(1),
  interest: z.array(z.string()),
});

export type onboardingFormFinalStepSchemaType = z.infer<
  typeof onboardingFormFinalStepSchema
>;
