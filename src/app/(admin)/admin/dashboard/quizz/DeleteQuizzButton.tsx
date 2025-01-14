import { LoadingButton } from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteQuizz } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface DeleteQuizzButtonProps {
  quizzId: string;
}

export function DeleteQuizzButton({ quizzId }: DeleteQuizzButtonProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => deleteQuizz(quizzId),
    onSuccess: () => {
      queryClient.invalidateQueries();

      setOpenDialog(false);

      toast({
        title: "Successfully deleted quizz",
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Question</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
            porro tenetur itaque commodi debitis quisquam aut fugit voluptatem
            ipsam aliquid.
          </DialogDescription>
        </DialogHeader>
        <div>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
