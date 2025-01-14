"use client";

import {
  Action,
  ActionType,
  OnboardingFormState,
  type OnboardingFormContext,
} from "@/lib/types";
import { Session } from "next-auth";
import { createContext, useContext, useReducer } from "react";

const OnboardingFormContext = createContext<OnboardingFormContext | null>(null);

const reducer = (
  state: OnboardingFormState,
  action: Action,
): OnboardingFormState => {
  const { type, payload } = action;

  switch (type) {
    case ActionType.SET_USERNAME:
      return {
        ...state,
        username: payload as string,
      };
    case ActionType.SET_NAME:
      return {
        ...state,
        name: payload as string,
      };
    case ActionType.MOVE_PAGE:
      return {
        ...state,
        step: payload as number,
      };
    case ActionType.SET_INTEREST:
      return {
        ...state,
        interest: payload as string[],
      };
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

export function OnboardingFormProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  const [state, dispatch] = useReducer(reducer, {
    name: session.user.name || "",
    username: session.user.username || "",
    interest: [],
    step: 1,
    profileImage: session.user.image || "",
  });

  return (
    <OnboardingFormContext.Provider value={{ ...state, dispatch }}>
      {children}
    </OnboardingFormContext.Provider>
  );
}

export const useOnboardingContext = () => {
  const context = useContext(OnboardingFormContext);

  if (!context)
    throw new Error(
      "useOnboardingContext must be used within an OnboardingFormProvider",
    );

  return context;
};
