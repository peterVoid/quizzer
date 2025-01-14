"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useUploadThing } from "@/lib/uploadthing";
import {
  categorySchema,
  categorySchemaType,
} from "@/lib/zod-schemas/addNewCategorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { newCategory } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "@/components/LoadingButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryResponsePagination } from "./CategoryTable";

export function AddNewCategory() {
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const form = useForm<categorySchemaType>({
    mode: "onChange",
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  const { startUpload, isUploading } = useUploadThing("singleImage");

  const queryClient = useQueryClient();

  const { mutate: mutateNewCategory, isPending: isPendingNewCategory } =
    useMutation({
      mutationFn: (formData: {
        categoryName: categorySchemaType;
        imageUrl: string | null;
      }) => newCategory(formData),
      onSuccess: async (data) => {
        await queryClient.cancelQueries({ queryKey: ["all-category"] });

        queryClient.setQueryData(
          ["all-category"],
          (oldData: CategoryResponsePagination | undefined) => {
            if (!oldData) {
              return {
                categories: [data.data],
                total: 1,
              };
            }

            return {
              categories: [data.data, ...oldData.categories],
              total: oldData.total + 1,
            };
          },
        );

        form.reset();

        toast({
          title: "Added new Category!",
        });
        queryClient.invalidateQueries();
      },
      onError: (error) => {
        console.log(error);
        if (error instanceof Error) {
          console.log("Error occured in addNewCategory", error);
          toast({
            title: "Category name is already used!",
            variant: "destructive",
          });
        }
      },
    });

  const onSubmitHandler = async (values: categorySchemaType) => {
    let photoUrl: string | null = null;
    if (profileImageFile) {
      const result = await startUpload([profileImageFile]);
      if (result?.[0].url) {
        photoUrl = result[0].url;
      }
    }
    mutateNewCategory({ categoryName: values, imageUrl: photoUrl });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add new category</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Category</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere
            quos at nihil reiciendis modi pariatur exercitationem numquam
            ratione voluptatem minus.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <UploadSingleImage
              textHeader="Thumbnail"
              className="size-14"
              setProfileImageFile={setProfileImageFile}
            />
          </div>
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(onSubmitHandler)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="eg: Matematika"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isUploading ? (
                <LoadingButton className="w-fit" />
              ) : (
                <Button type="submit" disabled={isPendingNewCategory}>
                  Send
                </Button>
              )}
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
