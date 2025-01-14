import { Prisma } from "@prisma/client";
import { User } from "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    username?: string | null;
    onboarded?: boolean;
    isAdmin?: boolean;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: string;
      name?: string | null;
      username?: string | null;
      onboarded?: boolean;
      isAdmin?: boolean;
    };
  }
}

// ONBOARDING
export enum ActionType {
  SET_USERNAME = "SET_USERNAME",
  SET_NAME = "SET_NAME",
  SET_INTEREST = "SET_INTEREST",
  MOVE_PAGE = "MOVE_PAGE",
}

// -------------------------------------------------------------

export type ActionPayload = string | string[] | number;

export type Action =
  | { type: ActionType.SET_USERNAME; payload: string }
  | { type: ActionType.SET_NAME; payload: string }
  | { type: ActionType.SET_INTEREST; payload: string[] }
  | { type: ActionType.MOVE_PAGE; payload: number };

export type OnboardingFormState = {
  username: string;
  name: string;
  interest: string[];
  step: number;
  profileImage: string;
};

export interface OnboardingFormContext extends OnboardingFormState {
  dispatch: React.Dispatch<Action>;
}

// --------------------------------------------------------

export const QuizzDataInclude = {
  category: {
    select: {
      id: true,
      name: true,
    },
  },
  questions: {
    select: {
      correctAnswer: true,
      questionOptions: true,
      questionTitle: true,
    },
  },
} satisfies Prisma.QuizzInclude;

export type QuizzDataIncludeType = Prisma.QuizzGetPayload<{
  include: typeof QuizzDataInclude;
}>;
