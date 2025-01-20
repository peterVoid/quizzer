"use client";

import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";

interface QuizzAlertProps {
  uniqueKey: string;
  duration: number;
  isCorrect: boolean;
}

export function QuizzAlert({
  duration,
  isCorrect,
  uniqueKey,
}: QuizzAlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [uniqueKey, duration, isCorrect]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className={cn(
          "flex h-80 w-80 scale-105 transform items-center justify-center rounded-xl p-6 text-white shadow-lg transition-transform duration-300",
          isCorrect ? "bg-green-500" : "bg-red-500",
        )}
      >
        {isCorrect ? <Check size={100} /> : <X size={100} />}
      </div>
    </div>
  );
}
