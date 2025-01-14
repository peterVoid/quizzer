import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface LoadingButtonProps {
  text?: string;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  className?: string;
}

export function LoadingButton({
  text,
  size,
  variant,
  className,
}: LoadingButtonProps) {
  return (
    <Button
      size={size}
      variant={variant}
      disabled
      className={cn("flex w-full items-center justify-center", className)}
    >
      <Loader2 className="mr-2 animate-spin" />
      {text && text}
    </Button>
  );
}
