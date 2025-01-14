"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QuizzDataIncludeType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { FcNumericalSorting21 } from "react-icons/fc";
import { DeleteQuizzButton } from "./DeleteQuizzButton";
import { useRouter } from "next/navigation";
import { BASEADMINURL } from "./AddNewQuizzButton";

export type QuzzResponseData = {
  quizz: QuizzDataIncludeType[];
  total: number;
};

export function QuizzTable() {
  const [page, setPage] = useState(1);
  const [sortByTitle, setSortByTitle] = useState("asc");
  const router = useRouter();
  const limit = 10;

  const { data: quizzData } = useQuery({
    queryKey: ["f_quizz-table", page, sortByTitle],
    queryFn: async () => {
      const response = await axios.get(
        `/api/a_quizz?page=${page}&limit=${limit}&sortByTitle=${sortByTitle}`,
      );
      return response.data as QuzzResponseData;
    },
    staleTime: Infinity,
  });

  if (!quizzData) {
    return <Loader2 className="animate-spin" />;
  }

  const totalPages = Math.ceil((quizzData.total || 0) / limit);

  return (
    <>
      <Table className="w-full">
        <TableCaption>A list of your Quizz.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead className="flex items-center gap-2">
              <p>Quizz Title</p>
              <button
                onClick={() =>
                  setSortByTitle((prev) => (prev === "asc" ? "desc" : "asc"))
                }
              >
                <FcNumericalSorting21 />
              </button>
            </TableHead>
            <TableHead>Quizz Image</TableHead>
            <TableHead>Quizz Category</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quizzData.quizz.map((quizz, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">
                {(page - 1) * limit + 1 + i}
              </TableCell>
              <TableCell>{quizz.title}</TableCell>
              <TableCell>
                {quizz.thumbnail && (
                  <Image
                    src={quizz.thumbnail!}
                    alt="Category Image"
                    width={10}
                    height={10}
                    className="size-10 object-cover"
                  />
                )}
              </TableCell>
              <TableCell>{quizz.category.name}</TableCell>
              <TableCell className="text-right">
                <Button
                  onClick={() =>
                    router.push(`${BASEADMINURL}/quizz/edit/${quizz.id}`)
                  }
                >
                  Edit
                </Button>
                <DeleteQuizzButton quizzId={quizz.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </>
  );
}
