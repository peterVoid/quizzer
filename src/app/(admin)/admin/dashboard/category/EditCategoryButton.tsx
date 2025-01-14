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
import {
  categorySchema,
  categorySchemaType,
} from "@/lib/zod-schemas/addNewCategorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { editCategory } from "./actions";
import { useUploadThing } from "@/lib/uploadthing";
import { LoadingButton } from "@/components/LoadingButton";
import { useToast } from "@/hooks/use-toast";

interface DeleteCategoryButtonProps {
  category: Category;
}

export function EditCategoryButton({ category }: DeleteCategoryButtonProps) {
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const form = useForm<categorySchemaType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name || "",
    },
  });

  const { startUpload, isUploading } = useUploadThing("singleImage");

  const queryClient = useQueryClient();

  const { mutate: mutateUpdateCategory, isPending: isPendingUpdateCategory } =
    useMutation({
      mutationFn: async (formData: {
        categoryId: string;
        categoryName: categorySchemaType;
        imageUrl: string | null;
      }) => editCategory(formData),
      onSuccess: async () => {
        queryClient.invalidateQueries();
        toast({
          title: "Successfully updated category",
        });
      },
      onError: (error) => {
        console.error("Error when edit category", error);
        toast({
          title: "Name of category is already taken.",
          variant: "destructive",
        });
      },
    });

  const onSubmitHandler = async (values: categorySchemaType) => {
    let photoUrl: string | null = category.image || null;
    if (profileImageFile) {
      const result = await startUpload([profileImageFile]);
      if (result?.[0].url) {
        photoUrl = result[0].url;
      }
    }

    mutateUpdateCategory({
      categoryId: category.id,
      categoryName: values,
      imageUrl: photoUrl || category.image,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere
            quos at nihil reiciendis modi pariatur exercitationem numquam
            ratione voluptatem minus.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <UploadSingleImage
              profileImage={category.image || ""}
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
                <Button
                  type="submit"
                  disabled={isPendingUpdateCategory || isUploading}
                >
                  Edit
                </Button>
              )}
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
