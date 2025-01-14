"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useOnboardingContext } from "../context/OnboardingFormContext";
import { FirstStep } from "./step/FirstStep";
import { Progress } from "@/components/ui/progress";
import { SessionProvider, useSession } from "next-auth/react";
import { SecondStep } from "./step/SecondStep";
import { FinalStep } from "./step/FinalStep";

export default function Page() {
  const { step } = useOnboardingContext();

  const totalSteps = 3;
  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <SessionProvider>
      <Card className="w-full max-w-4xl shadow-lg">
        <Progress value={progress} className="absolute bottom-10 left-0" />
        <CardHeader>
          <CardTitle className="text-4xl md:text-5xl">Onboarding 👋</CardTitle>
          <CardDescription className="text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Accusantium, commodi magnam porro consequatur recusandae quisquam!
            Ratione magnam unde pariatur vero?
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && <FirstStep />}
          {step === 2 && <SecondStep />}
          {step === 3 && <FinalStep />}
        </CardContent>
      </Card>
    </SessionProvider>
  );
}
