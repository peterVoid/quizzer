"use server";

import { prisma } from "@/lib/prisma";
import {
  quizzFormSchema,
  quizzFormSchemaType,
} from "@/lib/zod-schemas/quizzFormSchema";

export const submitQuizzForm = async (formData: {
  formValues: quizzFormSchemaType;
  imageUrl: string | null;
}) => {
  try {
    const { formValues, imageUrl } = formData;

    const validateFields = quizzFormSchema.safeParse(formValues);

    if (!validateFields.success) {
      return validateFields.error.flatten().fieldErrors;
    }

    const { categoryId, description, questions, title } = validateFields.data;

    const createdQuizz = await prisma.quizz.create({
      data: {
        title,
        description,
        thumbnail: imageUrl,
        categoryId,
      },
    });

    const createdQuizQuestionInfo =
      await prisma.quizzQustionAndOptions.createMany({
        data: questions.map((question) => ({
          quizzId: createdQuizz.id,
          questionTitle: question.questionTitle,
          correctAnswer: question.correctAnswer,
          questionOptions: question.questionOptions,
        })),
      });

    return {
      success: true,
      message: "Quizz successfully created!",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      errors: {
        root: "Error occured when submitting form. Please try again",
      },
    };
  }
};

export const editQuizzForm = async (formData: {
  formValues: quizzFormSchemaType;
  imageUrl: string | null;
  quizzId: string;
}) => {
  try {
    const { formValues, imageUrl, quizzId } = formData;

    const validateFields = quizzFormSchema.safeParse(formValues);

    if (!validateFields.success) {
      return validateFields.error.flatten().fieldErrors;
    }

    const { categoryId, description, questions, title } = validateFields.data;

    const createdQuizz = await prisma.quizz.update({
      where: { id: quizzId },
      data: {
        title,
        description,
        thumbnail: imageUrl,
        categoryId,
      },
    });

    await prisma.quizzQustionAndOptions.deleteMany({
      where: { quizzId },
    });

    await prisma.quizzQustionAndOptions.createMany({
      data: questions.map((question) => ({
        quizzId: createdQuizz.id,
        questionTitle: question.questionTitle,
        correctAnswer: question.correctAnswer,
        questionOptions: question.questionOptions,
      })),
    });

    return {
      success: true,
      message: "Quizz successfully created!",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      errors: {
        root: "Error occured when submitting form. Please try again",
      },
    };
  }
};
