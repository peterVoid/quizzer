"use server";

import { prisma } from "@/lib/prisma";
import { signInSchema, signInSchemaType } from "@/lib/zod-schemas/signInSchema";
import { signUpSchema, signUpSchemaType } from "@/lib/zod-schemas/signUpSchema";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export const signup = async (values: signUpSchemaType) => {
  const validateFields = signUpSchema.safeParse(values);

  if (!validateFields.success) {
    return {
      success: false,
      errors: validateFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, username } = validateFields.data;

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existingUser) {
      return {
        success: false,
        errors: {
          email:
            existingUser.email === email ? "Email already in use" : undefined,
          username:
            existingUser.username === username
              ? "Username already in use"
              : undefined,
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        hashedPassword,
        username,
        name: email.split("@")[0],
        isAdmin: email === "admin@gmail.com",
      },
    });

    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error) {
    console.error("Error during sign-up", error);
    return {
      success: false,
      errors: {
        root: "An error occured. Please try again.",
      },
    };
  }
};

export const signin = async (values: signInSchemaType) => {
  const validateFields = signInSchema.safeParse(values);

  if (!validateFields.success) {
    return {
      success: false,
      errors: validateFields.error.flatten().fieldErrors,
    };
  }

  const { identifier, password } = validateFields.data;

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { username: identifier }] },
    });

    if (!existingUser || !existingUser.hashedPassword) {
      return {
        success: false,
        errors: {
          identifier: "User not found",
        },
      };
    }

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.hashedPassword,
    );

    console.log(isValidPassword);

    if (!isValidPassword) {
      return {
        success: false,
        errors: {
          password: "Invalid Password",
        },
      };
    }

    return {
      success: true,
      message: "Logged in successfully",
    };
  } catch (error) {
    console.error("error during sign-up", error);
    return {
      success: false,
      errors: {
        root: "An error occured. Please try again.",
      },
    };
  }
};
