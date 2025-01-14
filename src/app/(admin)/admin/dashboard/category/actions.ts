"use server";

import { prisma } from "@/lib/prisma";
import {
  categorySchema,
  categorySchemaType,
} from "@/lib/zod-schemas/addNewCategorySchema";

export const newCategory = async (formData: {
  categoryName: categorySchemaType;
  imageUrl: string | null;
}) => {
  const { categoryName, imageUrl } = formData;

  const validateFields = categorySchema.safeParse(categoryName);

  if (!validateFields.success) {
    return {
      success: false,
      errors: validateFields.error.flatten().fieldErrors,
    };
  }

  try {
    const existingCategory = await prisma.category.findUnique({
      where: { name: categoryName.name.toUpperCase().trim() },
    });

    if (existingCategory && existingCategory.name === categoryName.name)
      throw new Error("fuck");

    const newCategory = await prisma.category.create({
      data: {
        name: validateFields.data.name.toUpperCase().trim(),
        image: imageUrl,
      },
    });

    return {
      success: true,
      message: "Added new category 🚀",
      data: newCategory,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editCategory = async (formData: {
  categoryId: string;
  categoryName: categorySchemaType;
  imageUrl: string | null;
}) => {
  const { categoryName, imageUrl, categoryId } = formData;

  const validateFields = categorySchema.safeParse(categoryName);

  if (!validateFields.success) {
    return {
      success: false,
      errors: validateFields.error.flatten().fieldErrors,
    };
  }

  try {
    const existingCategory = await prisma.category.findUnique({
      where: { name: categoryName.name.toUpperCase().trim() },
    });

    if (existingCategory && existingCategory.id !== categoryId)
      throw new Error("Name of category is already taken.");

    const updatedCategory = await prisma.category.update({
      where: { id: formData.categoryId },
      data: {
        name: validateFields.data.name.toUpperCase().trim(),
        image: imageUrl,
      },
    });

    return {
      success: true,
      message: "Updated category 🚀",
      data: updatedCategory,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    const findCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!findCategory) throw new Error("Category not found");

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return { message: "Successfully deleted category" };
  } catch (error) {
    console.error(error);
  }
};
