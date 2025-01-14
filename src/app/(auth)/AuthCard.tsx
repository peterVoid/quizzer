"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { ImGithub } from "react-icons/im";
import { SignInForm } from "./sign-in/SignInForm";
import SignUpForm from "./sign-up/SignUpForm";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthCardProps {
  isLoggedIn?: boolean;
}

export function AuthCard({ isLoggedIn = false }: AuthCardProps) {
  const searchParams = useSearchParams();
  const getError = searchParams.get("");
  const [error, setError] = useState(false);

  const handleOAuthLoggedIn = async (provider: "google" | "github") => {
    await signIn(provider, {
      callbackUrl: "/dashboard",
    });
  };

  useEffect(() => {
    if (getError) {
      setError(true);
    }
  }, [searchParams]);

  return (
    <Card className="w-full max-w-md">
      {error && (
        <p className="my-3 text-center text-destructive">
          Something went wrong
        </p>
      )}
      <CardHeader className="text-center">
        <CardTitle>
          {isLoggedIn ? "Welcome Back" : "Create an Account"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthLoggedIn("google")}
          >
            <FcGoogle className="mr-2 size-4" /> Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthLoggedIn("github")}
          >
            <ImGithub className="mr-2 size-4" /> Continue with Github
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-between text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">OR</span>
          </div>
        </div>

        {isLoggedIn ? <SignInForm /> : <SignUpForm />}
      </CardContent>
      <CardFooter>
        {isLoggedIn ? (
          <span>
            Dont&apos;s have an account?{" "}
            <Link href="/sign-up" className="text-primary hover:underline">
              Sign Up
            </Link>
          </span>
        ) : (
          <span>
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign In
            </Link>
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
