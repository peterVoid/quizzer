"use server";

import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { onboardingFormFinalStepSchema } from "@/lib/zod-schemas/onboardingFormFinalStepSchema";
import { UserInteresting } from "@prisma/client";

interface onboardingType {
  name: string;
  username: string;
  interest: string[];
}

export const onboarding = async (formData: onboardingType) => {
  const session = await getAuthSession();

  if (!session) {
    return {
      success: false,
      errors: {
        root: "Your must be logged in to complete onboarding",
      },
    };
  }

  const validateFields = onboardingFormFinalStepSchema.safeParse(formData);

  if (!validateFields.success) {
    return {
      success: false,
      errors: validateFields.error.flatten().fieldErrors,
    };
  }

  const { name, username, interest } = validateFields.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          name,
          username,
          onboarded: true,
        },
      });

      await tx.userInterest.createMany({
        data: interest.map((i) => ({
          interest: i as UserInteresting,
          userId: session.user.id,
        })),
      });
    });

    return {
      success: true,
      message: "Successfully onboarded!",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      errors: {
        root: "An error occured. Please try again.",
      },
    };
  }
};
