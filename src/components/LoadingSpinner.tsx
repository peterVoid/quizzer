import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
      <Loader2 size="30" className="animate-spin" />
    </div>

  )
}
