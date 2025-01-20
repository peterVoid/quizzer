"use client";

import { QuizzCard } from "@/components/QuizzCard";
import { QuizzDataIncludeType, RecentlyQuizzIncludeType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function RecentActivity() {
  const { data, isLoading } = useQuery({
    queryKey: ["f_recentlyQuizzByUser"],
    queryFn: async () => {
      const response = await axios.get("/api/user/getRecentlyQuizz");

      return response.data as RecentlyQuizzIncludeType[];
    },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-medium">Recently</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {!isLoading &&
          data &&
          data.map((data, index) => (
            <QuizzCard key={index} quizz={data.quizz} />
          ))}
      </div>
    </div>
  );
}
