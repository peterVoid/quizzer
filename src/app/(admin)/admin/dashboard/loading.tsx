import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="absolute inset-0 flex size-full items-center justify-center">
      <Loader2 className="animate-spin" size={30} />
    </div>
  );
}
