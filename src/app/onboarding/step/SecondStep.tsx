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
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronLeft, ChevronRight, CodeXml, History } from "lucide-react";
import { useForm } from "react-hook-form";
import { MdOutlineScience } from "react-icons/md";

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



  const { data: categoryData, isLoading } = useQuery({
    queryKey: ['f_onboarding_category'],
    queryFn: async () => {
      const response = await axios.get("/api/quizz/category");

      return response.data as Category[]
    }
  })

  if (!categoryData) return;

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
                <div className="grid grid-cols-2">
                  {categoryData.map(category => (
                    <FormField
                      key={category.id}
                      control={form.control}
                      name="interest"
                      render={({ field }) => (
                        <FormItem key={category.id} className="flex flex-row items-center gap-3 space-y-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(category.name)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, category.name])
                                  : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== category.name
                                    )
                                  )
                              }}
                            />
                          </FormControl>
                          {category.name}
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
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
