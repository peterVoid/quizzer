import { useOnboardingContext } from "@/app/context/OnboardingFormContext";
import { Button } from "@/components/ui/button";
import { ActionType } from "@/lib/types";
import { ChevronLeft } from "lucide-react";
import { onboarding } from "../actionts";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { LoadingButton } from "@/components/LoadingButton";
import { useRouter } from "next/navigation";

export function FinalStep() {
  const { name, username, interest, step, dispatch } = useOnboardingContext();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleBackBtnClick = () => {
    dispatch({ type: ActionType.MOVE_PAGE, payload: step - 1 });
  };

  const handleOnboardingButton = async () => {
    startTransition(async () => {
      const result = await onboarding({ name, username, interest });

      if (result.success) {
        toast({
          title: "Onboarding Info",
          description: result.message,
        });
        router.push("/");
      } else {
        toast({
          title: "Onboarding Info",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-center text-3xl font-bold">Final Step 😍</h1>
      <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium text-muted-foreground">
              Name
            </span>
            <p className="text-lg font-semibold">{name}</p>
          </div>

          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium text-muted-foreground">
              Username
            </span>
            <p className="text-lg font-semibold">{username}</p>
          </div>

          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium text-muted-foreground">
              Interests
            </span>
            <div className="flex flex-wrap gap-2">
              {interest.map((item, index) => (
                <span
                  key={index}
                  className="rounded-full bg-muted px-3 py-1 text-sm font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Button onClick={handleBackBtnClick}>
            <ChevronLeft /> Back
          </Button>
          <div>
            {isPending ? (
              <LoadingButton />
            ) : (
              <Button onClick={handleOnboardingButton}>Submit</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
