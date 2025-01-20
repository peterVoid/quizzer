"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { QuizzAlert } from "@/components/QuizzAlert";
import { QuizzQustionAndOptions } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Medal, Timer, Trophy } from "lucide-react";
import Link from "next/link";
import { MdScoreboard } from "react-icons/md";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface QuizzWorkProps {
  quizzId: string;
}

export function QuizzWork({ quizzId }: QuizzWorkProps) {
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [userAnswer, setUserAnswer] = useState("");
  const [totalCorrectAnswer, setTotalCorrectAnswer] = useState(0);
  const [totalWrongAnswer, setTotalWrongAnswer] = useState(0);
  const [showAlert, setShowAlert] = useState<"correct" | "wrong" | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [trackUserAnswer, setTrackUserAnswer] = useState<string[]>([]);
  const [runningTimer, setRunningTimer] = useState(true);

  const router = useRouter();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}m ${remainingSeconds}s`;
  };

  useEffect(() => {
    if (runningTimer) {
      const timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [runningTimer]);

  const { data, isLoading } = useQuery({
    queryKey: ["quizz-activity", quizzId],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/quizz/quizz-work/${quizzId}`,
      );

      return response.data;
    },
    staleTime: Infinity,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const questions = data.questions as QuizzQustionAndOptions[];

  const selectCurrentMainQuizz = questions[currentQuestionNumber - 1];

  const isLastQuestion = currentQuestionNumber === questions.length;

  const onHandleClick = () => {
    setTrackUserAnswer((prev) => [...prev, userAnswer]);

    const isCorrect = selectCurrentMainQuizz.correctAnswer === userAnswer;

    if (isCorrect) {
      setTotalCorrectAnswer((prev) => prev + 1);
    } else {
      setTotalWrongAnswer((prev) => prev + 1);
    }

    setShowAlert(isCorrect ? "correct" : "wrong");

    setTimeout(() => {
      setShowAlert(null);
      setUserAnswer("");
      setCurrentQuestionNumber((prev) => prev + 1);
    }, 1000);

    if (isLastQuestion) {
      setRunningTimer(false);
    }
  };

  const calculateScore = () => {
    const totalQuestion = questions.length;
    const score = (totalCorrectAnswer / totalQuestion) * 100;

    return score.toFixed(0);
  };

  return currentQuestionNumber <= questions.length ? (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3">
      <div>{formatTime(timeElapsed)}</div>
      <p className="text-xl font-bold">
        Question {currentQuestionNumber}/{questions.length}
      </p>
      {showAlert ? (
        <QuizzAlert
          duration={1000}
          isCorrect={showAlert === "correct"}
          uniqueKey={`${showAlert}-${Date.now()}`}
        />
      ) : null}
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="flex gap-2 text-xl font-medium">
            <p>{currentQuestionNumber}.</p>
            <p className="">{selectCurrentMainQuizz.questionTitle}</p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <RadioGroup
              value={userAnswer}
              onValueChange={(e) => setUserAnswer(e)}
            >
              {Array.isArray(selectCurrentMainQuizz.questionOptions) &&
                selectCurrentMainQuizz.questionOptions.map(
                  (data: any, i: number) => (
                    <div key={i} className="flex items-center space-x-2">
                      <RadioGroupItem value={data.value} />
                      <Label className="text-md">{data.desc}</Label>
                    </div>
                  ),
                )}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center justify-end">
            <Button disabled={!userAnswer} onClick={onHandleClick}>
              {isLastQuestion ? "Submit" : "Next"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  ) : (
    <div className="mx-auto w-full max-w-6xl space-y-5 py-10">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-4xl font-bold">Summary</h1>
        <Button asChild>
          <Link href={`${process.env.NEXT_PUBLIC_APP_BASE_URL}/dashboard`}>
            Back to Dashboard
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Results</h2>
            <Medal />
          </div>
        </CardHeader>
        <CardContent className="mx-auto flex flex-col items-center justify-center gap-3">
          <Trophy size={50} />
          <h3 className="text-xl font-semibold">
            {Number(calculateScore()) > 70 ? "Impressive!" : "Not enough"}
          </h3>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Score</h2>
              <MdScoreboard size={30} />
            </div>
          </CardHeader>
          <CardContent>{Number(calculateScore())}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Time Taken</h2>
              <Timer size={30} />
            </div>
          </CardHeader>
          <CardContent>
            <h5>{formatTime(timeElapsed)}</h5>
          </CardContent>
        </Card>
        <div className="">
          <h1>Question and Answer</h1>
          <Table className="w-full">
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">No</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Correct Answer</TableHead>
                <TableHead className="text-right">Your Answer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((question, questionIndex) => (
                <TableRow key={questionIndex}>
                  <TableCell className="font-medium">
                    {questionIndex + 1}
                  </TableCell>
                  <TableCell>{question.questionTitle.slice(0, 50)}</TableCell>
                  <TableCell>{question.correctAnswer}</TableCell>
                  <TableCell>{trackUserAnswer[questionIndex]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
