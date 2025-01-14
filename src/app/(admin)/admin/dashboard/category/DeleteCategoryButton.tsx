import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { CategoryResponsePagination } from "./CategoryTable";
import { LoadingButton } from "@/components/LoadingButton";

interface DeleteCategoryButtonProps {
  categoryId: string;
}

export function DeleteCategoryButton({
  categoryId,
}: DeleteCategoryButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["all-category"];

  const { mutate, isPending } = useMutation({
    mutationFn: async () => deleteCategory(categoryId),
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey: ["all-category"] });

      queryClient.setQueryData(
        ["all-category"],
        (oldData: CategoryResponsePagination | undefined) => {
          if (!oldData) return;

          return {
            categories: oldData.categories.filter(
              (category) => category.id !== categoryId,
            ),
            total: oldData.total - 1,
          };
        },
      );

      queryClient.invalidateQueries();

      toast({
        title: "Category Deleted",
      });
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast({
          title: err.message,
          variant: "destructive",
        });
      }
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
            porro tenetur itaque commodi debitis quisquam aut fugit voluptatem
            ipsam aliquid.
          </DialogDescription>
        </DialogHeader>
        {isPending ? (
          <LoadingButton variant="destructive" />
        ) : (
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => mutate()}
          >
            Delete
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
