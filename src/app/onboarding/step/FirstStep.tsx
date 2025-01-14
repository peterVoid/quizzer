import { useOnboardingContext } from "@/app/context/OnboardingFormContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UploadSingleImage } from "@/components/UploadSingleImage";
import { useToast } from "@/hooks/use-toast";
import { prisma } from "@/lib/prisma";
import { ActionType } from "@/lib/types";
import { useUploadThing } from "@/lib/uploadthing";
import {
  onboardingFormFirstStepSchema,
  onboardingFormFirstStepSchemaType,
} from "@/lib/zod-schemas/onboardingFormFirstStepSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { uploadProfileImage } from "./actions";

export function FirstStep() {
  const { dispatch, step, profileImage, username, name } =
    useOnboardingContext();
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const router = useRouter();
  const { update } = useSession();
  const { toast } = useToast();

  const { startUpload, isUploading } = useUploadThing("singleImage", {
    onClientUploadComplete: async (res) => {
      const uploadResult = await uploadProfileImage(res[0].url);

      if (!uploadResult.success) {
        toast({
          title: "Error Upload Image",
          description: uploadResult.error?.root || "Something went wrong",
          variant: "destructive",
        });
      }
      await update();
      router.refresh();
    },
    onUploadError: (error) => {
      console.error(error);
      toast({
        title: "Upload Error",
        description: "Failed to upload profile image, Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<onboardingFormFirstStepSchemaType>({
    mode: "onChange",
    resolver: zodResolver(onboardingFormFirstStepSchema),
    defaultValues: {
      username: username ?? "",
      name: name ?? "",
    },
  });

  const onSubmitHandler = async (values: onboardingFormFirstStepSchemaType) => {
    try {
      if (profileImageFile) {
        await startUpload([profileImageFile]);
      }

      dispatch({ type: ActionType.SET_USERNAME, payload: values.username });
      dispatch({ type: ActionType.SET_NAME, payload: values.name });
      dispatch({ type: ActionType.MOVE_PAGE, payload: step + 1 });
    } catch (error) {
      console.error("Form submission failed:", error);
      toast({
        title: "Error",
        description: "Something went wrong, Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold underline">First Step 1️⃣</h1>
      <UploadSingleImage
        textHeader="Profile photo"
        profileImage={profileImage}
        setProfileImageFile={setProfileImageFile}
      />
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmitHandler)}
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isUploading}>
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
}
