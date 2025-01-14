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
import { Category, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export type UserResponsePagination = {
  users: User[];
  total: number;
};

export function UsersTable() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: userData } = useQuery({
    queryKey: ["all-user", page],
    queryFn: async () => {
      const response = await axios.get(
        `/api/a_users?page=${page}&limit=${limit}`,
      );
      return response.data as UserResponsePagination;
    },
    staleTime: Infinity,
  });

  if (!userData) {
    return <Loader2 className="animate-spin" />;
  }

  const totalPages = Math.ceil((userData.total || 0) / limit);

  return (
    <>
      <Table className="w-full">
        <TableCaption>A list of your User.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            {/* <TableHead className="text-right">Action</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {userData.users.map((user, i) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {(page - 1) * limit + 1 + i}
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.username.slice(0, 15)}...</TableCell>
              <TableCell>{user.email?.slice(0, 15)}...</TableCell>
              {/* <TableCell className="text-right"></TableCell> */}
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
