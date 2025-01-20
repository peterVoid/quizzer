"use client";

import { Category as CategoryType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Search } from "lucide-react";
import Link from "next/link";

export function SearchBarWithCategory() {
  return (
    <section className="h-56 bg-purple-400/20">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col items-center justify-center gap-3">
        <h2 className="text-2xl font-semibold">What are you doing today?🫣</h2>
        <SearchBar />
        <Category />
      </div>
    </section>
  );
}

function SearchBar() {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white p-3">
      <Search />
      <input
        type="text"
        placeholder="Search for any category/topics"
        className="bg-transparent text-sm focus:outline-none"
      />
    </div>
  );
}

function Category() {
  const { data, isLoading } = useQuery({
    queryKey: ["f_filtered-category"],
    queryFn: async () => {
      const response = await axios.get("/api/quizz/category");

      return response.data as CategoryType[];
    },
  });

  if (isLoading) return;

  return (
    <div className="space-y-3">
      <h4 className="text-lg font-medium">Featured Category</h4>
      <div className="flex items-center justify-center gap-2">
        {data?.slice(0, 5).map((item) => (
          <Link
            key={item.id}
            href={`/dashboard/?category=${item.name}`}
            className="hover:underline"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
