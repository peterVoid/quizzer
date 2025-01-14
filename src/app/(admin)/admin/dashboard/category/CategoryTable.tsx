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
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { EditCategoryButton } from "./EditCategoryButton";
import { DeleteCategoryButton } from "./DeleteCategoryButton";

export type CategoryResponsePagination = {
  categories: Category[];
  total: number;
};

export function CategoryTable() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: categoryData } = useQuery({
    queryKey: ["all-category", page],
    queryFn: async () => {
      const response = await axios.get(
        `/api/a_category?page=${page}&limit=${limit}`,
      );
      return response.data as CategoryResponsePagination;
    },
    staleTime: Infinity,
  });

  if (!categoryData) {
    return <Loader2 className="animate-spin" />;
  }

  const totalPages = Math.ceil((categoryData.total || 0) / limit);

  return (
    <>
      <Table className="w-full">
        <TableCaption>A list of your Category.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Category Name</TableHead>
            <TableHead>Category Image</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categoryData.categories.map((category, i) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">
                {(page - 1) * limit + 1 + i}
              </TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>
                {category.image && (
                  <Image
                    src={category.image!}
                    alt="Category Image"
                    width={10}
                    height={10}
                    className="size-10 object-cover"
                  />
                )}
              </TableCell>
              <TableCell className="text-right">
                <EditCategoryButton category={category} />
                <DeleteCategoryButton categoryId={category.id} />
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
