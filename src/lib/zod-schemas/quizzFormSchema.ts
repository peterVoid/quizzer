import { z } from "zod";

export const quizzQuestion = z.object({
  questionTitle: z
    .string()
    .trim()
    .min(3, { message: "Qustion Title must be at least 3 characters long" }),
  questionOptions: z
    .array(
      z.object({
        value: z.string().trim().min(1).max(1),
        desc: z
          .string()
          .trim()
          .min(1, { message: "Option text cannot be empty" }),
      }),
    )
    .min(2, { message: "At least 2 options are required" })
    .max(5, { message: "Maximum of 5 options allowed" }),
  correctAnswer: z.string().min(1, { message: "Correct answer is required" }),
});

export const quizzFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title must be at least 1 character long" }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Description must be at least 1 character long" })
    .max(200, {
      message: "Description must be less than equal to 200 characters",
    }),
  categoryId: z.string().min(1),
  questions: z
    .array(quizzQuestion)
    .min(1, { message: "At least 1 question is required" }),
});

export type quizzFormSchemaType = z.infer<typeof quizzFormSchema>;

export type quizzQuestion = z.infer<typeof quizzQuestion>;
