import { QuizzDataIncludeType } from "@/lib/types";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MdCategory } from "react-icons/md";

interface QuizzCardProps {
  quizz: QuizzDataIncludeType;
}

export function QuizzCard({ quizz }: QuizzCardProps) {
  return (
    <Link href={`/dashboard/quizz/${quizz.id}`} className="group">
      <Card className="relative h-[300px] overflow-hidden border-none bg-muted transition-transform duration-300 hover:shadow-md group-hover:scale-105">
        {/* Recently Viewed Badge */}
        <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-muted-foreground px-3 py-1.5 text-sm text-primary backdrop-blur-sm">
          <MdCategory className="h-4 w-4" />
          <span>{quizz.category.name}</span>
        </div>

        {/* Center Icon */}
        <div className="relative z-10 flex justify-center py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2A9D8F]">
            <div className="relative h-3 w-3 rounded-full bg-white">
              <div className="absolute -right-2 -top-2 h-2 w-2 rounded-full bg-white" />
            </div>
          </div>
        </div>

        {/* Question Count */}
        <CardContent className="relative z-10 pb-3 text-center">
          <Badge className="mb-4">{quizz.questions.length} questions</Badge>
        </CardContent>

        <div className="text-center">
          <h3 className="mb-1 text-xl font-semibold">{quizz.title}</h3>
        </div>
      </Card>
    </Link>
  );
}
