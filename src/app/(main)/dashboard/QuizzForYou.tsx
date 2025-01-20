"use client";

import { QuizzCard } from "@/components/QuizzCard";
import { QuizzDataIncludeType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function QuizzForYou() {
  const { data: quizzData, isLoading } = useQuery({
    queryKey: ["f_quizzByUserInterest"],
    queryFn: async () => {
      const response = await axios.get("/api/user/userInterest");

      return response.data as QuizzDataIncludeType[];
    },
    staleTime: Infinity,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-medium">For You</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {quizzData &&
          !isLoading &&
          quizzData.map((quizz, quizzIndex) => (
            <QuizzCard key={quizzIndex} quizz={quizz} />
          ))}
      </div>
    </div>
  );
}
