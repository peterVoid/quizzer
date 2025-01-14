"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const BASEADMINURL = "/admin/dashboard";

export function AddNewQuizzButton() {
  const router = useRouter();

  return (
    <Button onClick={() => router.push(`${BASEADMINURL}/quizz/create`)}>
      Add new Quizz
    </Button>
  );
}
