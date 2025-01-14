import { useOnboardingContext } from "@/app/context/OnboardingFormContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ActionType } from "@/lib/types";
import { onboardingFormSecondStepSchema } from "@/lib/zod-schemas/onboardingFormSecondStepSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserInteresting } from "@prisma/client";
import { ChevronLeft, ChevronRight, CodeXml, History } from "lucide-react";
import { useForm } from "react-hook-form";
import { MdOutlineScience } from "react-icons/md";

const interestOptions = [
  {
    label: "Science",
    value: UserInteresting.SCIENCE,
    icon: <MdOutlineScience size={20} />,
  },
  {
    label: "Programming",
    value: UserInteresting.PROGRAMMING,
    icon: <CodeXml size={20} />,
  },
  {
    label: "History",
    value: UserInteresting.HISTORY,
    icon: <History size={20} />,
  },
] as const;

export function SecondStep() {
  const { dispatch, step, interest } = useOnboardingContext();

  const form = useForm<onboardingFormSecondStepSchema>({
    mode: "onChange",
    resolver: zodResolver(onboardingFormSecondStepSchema),
    defaultValues: {
      interest: interest ?? [],
    },
  });

  const handleBackStep = () => {
    dispatch({ type: ActionType.MOVE_PAGE, payload: step - 1 });
  };

  const onSubmitHandler = async (values: onboardingFormSecondStepSchema) => {
    dispatch({ type: ActionType.SET_INTEREST, payload: values.interest });
    dispatch({ type: ActionType.MOVE_PAGE, payload: step + 1 });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold underline">Second Step 2️⃣</h1>
      <Form {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit(onSubmitHandler)}
        >
          <FormField
            control={form.control}
            name="interest"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base text-muted-foreground">
                    Choose a topic of your interest
                  </FormLabel>
                </div>
                {interestOptions.map((interestOption) => (
                  <FormField
                    key={interestOption.value}
                    control={form.control}
                    name="interest"
                    render={({ field }) => (
                      <FormItem className="flex w-fit flex-row items-start space-x-3 space-y-0 rounded-md bg-muted px-3 py-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(
                              interestOption.value,
                            )}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([
                                    ...field.value,
                                    interestOption.value,
                                  ])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== interestOption.value,
                                    ),
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="flex items-center gap-2 font-normal">
                          {interestOption.icon}
                          {interestOption.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full items-center justify-between">
            <Button type="button" onClick={handleBackStep}>
              <ChevronLeft /> Back
            </Button>
            <Button type="submit">
              Continue <ChevronRight />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
