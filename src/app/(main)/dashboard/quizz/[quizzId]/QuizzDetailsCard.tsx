"use client";

import { Save, Share2, MoreVertical, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { QuizzDataIncludeType } from "@/lib/types";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { playQuizz } from "./actions";
import { useRouter } from "next/navigation";

interface QuizzDetailCardType {
  quizzId: string;
}

export function QuizzDetailCard({ quizzId }: QuizzDetailCardType) {
  const router = useRouter();

  const { data: quizzDetailsData, isLoading: quizzDetailsDataLoading } =
    useQuery({
      queryKey: ["f_quizzDetails", quizzId],
      queryFn: async () => {
        const response = await axios.get(`/api/quizz/quizzDetails/${quizzId}`);

        return response.data as QuizzDataIncludeType;
      },
      staleTime: 0,
    });

  const { mutate, isPending } = useMutation({
    mutationFn: () => playQuizz(quizzId),
    onSuccess: () => {
      router.push(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/dashboard/activity/${quizzId}`,
      );
    },
    onError: (error) => {
      console.log(error);
    },
  });

  if (quizzDetailsDataLoading || !quizzDetailsData) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Card className="border-0 shadow-sm">
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            {/* Quiz Icon */}
            <div className="relative flex h-16 w-16 items-center justify-center rounded-lg bg-[#E6F7F5]">
              {quizzDetailsData.thumbnail ? (
                <Image
                  src={quizzDetailsData.thumbnail}
                  alt="Thumbnail"
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-[#2A9D8F]">Q</span>
              )}
            </div>

            {/* Quiz Info */}
            <div className="flex-1">
              <h1 className="mb-2 text-2xl font-bold">
                {quizzDetailsData.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                    {quizzDetailsData.user?.image ? (
                      <Image
                        src={quizzDetailsData.user.image}
                        fill
                        alt="User Image"
                        className="object-cover"
                      />
                    ) : (
                      <p className="text-sm">Q</p>
                    )}
                  </div>
                  <span>
                    {quizzDetailsData.user?.username ||
                      quizzDetailsData.user?.name ||
                      "Quizzer"}
                  </span>
                </div>
                <span>•</span>
                <span>{quizzDetailsData.category.name}</span>
              </div>
              <p className="leading-2 mt-3 break-words text-sm text-muted-foreground">
                {quizzDetailsData.description}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Copy link</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Play</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you ready? 🫣</DialogTitle>
                    <DialogDescription>
                      You have to complete all question in 30 minutes
                    </DialogDescription>
                  </DialogHeader>
                  <Button onClick={() => mutate()} disabled={isPending}>
                    {"Let's go 🚀"}
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
