"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  quizzFormSchema,
  quizzFormSchemaType,
} from "@/lib/zod-schemas/quizzFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import axios from "axios";
import { Category } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ImWarning } from "react-icons/im";
import { UploadSingleImage } from "@/components/UploadSingleImage";
import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { editQuizzForm, submitQuizzForm } from "./actions";
import { useRouter } from "next/navigation";
import { BASEADMINURL } from "../AddNewQuizzButton";
import { QuizzDataIncludeType } from "@/lib/types";

interface QuizzFormProps {
  quizzData?: QuizzDataIncludeType;
}

export function QuizzForm({ quizzData }: QuizzFormProps) {
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const form = useForm<quizzFormSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(quizzFormSchema),
    defaultValues: {
      title: quizzData?.title ?? "",
      description: quizzData?.description || "",
      categoryId: quizzData?.categoryId || "",
      questions: (quizzData?.questions as any) ?? [
        {
          questionTitle: "Question title",
          questionOptions: [
            { desc: "", value: "A" },
            { desc: "", value: "B" },
          ],
          correctAnswer: "A",
        },
      ],
    },
  });

  const { toast } = useToast();

  const {
    fields: questionFields,
    append: appendQuestions,
    remove: removeQuestions,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["f_categories"],
    queryFn: async () => {
      const response = await axios.get("/api/quizz/category");

      return response.data as Category[];
    },
    staleTime: Infinity,
  });

  const expandOptions = (questionNumber: number) => {
    const options = form.getValues(
      `questions.${questionNumber}.questionOptions`,
    );

    if (options.length < 5) {
      const newValue = String.fromCharCode(65 + options.length);
      form.setValue(`questions.${questionNumber}.questionOptions`, [
        ...options,
        { desc: "", value: newValue },
      ]);
    } else {
      alert("Options now allowed greather than 5.");
    }
  };

  const onRemoveOption = (
    questionIndex: number,
    questionOptionIndex: number,
  ) => {
    const getFormValues = form.getValues(
      `questions.${questionIndex}.questionOptions`,
    );

    if (getFormValues.length > 2) {
      const updatedOptions = getFormValues.filter(
        (_, i) => i !== questionOptionIndex,
      );

      const reorderedOptions = updatedOptions.map((option, index) => {
        return {
          ...option,
          value: String.fromCharCode(65 + index),
        };
      });

      form.setValue(
        `questions.${questionIndex}.questionOptions`,
        reorderedOptions,
      );
    } else {
      alert("Options must have at least 2 item.");
    }
  };

  const { startUpload, isUploading: isUploadingImageLoading } =
    useUploadThing("singleImage");

  const router = useRouter();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: {
      formValues: quizzFormSchemaType;
      imageUrl: string | null;
    }) =>
      !quizzData
        ? submitQuizzForm({
            formValues: formData.formValues,
            imageUrl: formData.imageUrl,
          })
        : editQuizzForm({
            formValues: formData.formValues,
            imageUrl: formData.imageUrl,
            quizzId: quizzData.id,
          }),
    onSuccess: async () => {
      router.push(`${BASEADMINURL}/quizz`);

      queryClient.invalidateQueries();
    },
    onError: async (error) => {
      console.error(error);
    },
  });

  const onSubmitHandler = async (values: quizzFormSchemaType) => {
    let imageUrl: string | null = quizzData?.thumbnail || null;
    if (profileImageFile) {
      const uploadResult = await startUpload([profileImageFile]);
      if (uploadResult) {
        imageUrl = uploadResult?.[0].url;
      }
    }

    mutate({ imageUrl, formValues: values });
  };

  return (
    <div className="max-w-4xl">
      <Alert className="mb-2" variant="destructive">
        <ImWarning className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          For question you must have at least 1 and for options in question have
          at least 2
        </AlertDescription>
      </Alert>
      <div className="mb-3">
        <UploadSingleImage
          textHeader="Thumbnail"
          profileImage={quizzData?.thumbnail! || ""}
          setProfileImageFile={setProfileImageFile}
        />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitHandler)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} className="resize-none" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select one category of quiz" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {data?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {questionFields.map((question, questionIndex) => {
            const options = form.watch(
              `questions.${questionIndex}.questionOptions`,
            );

            const correctAnswerAbj = options.map((_, i) =>
              String.fromCharCode(65 + i),
            );

            return (
              <div
                key={question.id}
                className="space-y-5 rounded-md border p-3 shadow-sm"
              >
                <span className="text-2xl font-bold">{questionIndex + 1}</span>
                <FormField
                  control={form.control}
                  name={`questions.${questionIndex}.questionTitle`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Title</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Options</FormLabel>
                  {options.map((option, optionIndex) => (
                    <div key={optionIndex} className="mb-2 flex gap-2">
                      <FormField
                        control={form.control}
                        name={`questions.${questionIndex}.questionOptions.${optionIndex}.desc`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder={`Option ${optionIndex + 1} `}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`questions.${questionIndex}.questionOptions.${optionIndex}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder={`Option ${optionIndex + 1} `}
                                readOnly
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        variant="destructive"
                        disabled={
                          isPending || isUploadingImageLoading || isLoading
                        }
                        onClick={() =>
                          onRemoveOption(questionIndex, optionIndex)
                        }
                      >
                        <Trash />
                      </Button>
                    </div>
                  ))}

                  <div className="flex items-center justify-between">
                    <Button
                      disabled={
                        isPending || isUploadingImageLoading || isLoading
                      }
                      type="button"
                      onClick={() => {
                        expandOptions(questionIndex);
                      }}
                    >
                      Add Option
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      disabled={
                        isPending || isUploadingImageLoading || isLoading
                      }
                      onClick={() => {
                        removeQuestions(questionIndex);
                      }}
                    >
                      Remove Question
                    </Button>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name={`questions.${questionIndex}.correctAnswer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correct Answer</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select correct answer of this question." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {correctAnswerAbj.map((val) => (
                            <SelectItem key={val} value={val}>
                              {val}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            );
          })}

          <div className="flex justify-between">
            <Button
              type="button"
              disabled={isPending || isUploadingImageLoading || isLoading}
              onClick={() =>
                appendQuestions({
                  questionTitle: "Question Title",
                  correctAnswer: "A",
                  questionOptions: [
                    { desc: "", value: "A" },
                    { desc: "", value: "B" },
                  ],
                })
              }
            >
              Add New Question
            </Button>
            {questionFields.length > 0 && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeQuestions()}
                disabled={isPending || isUploadingImageLoading || isLoading}
              >
                Remove All Question
              </Button>
            )}
            <Button
              type="submit"
              variant="outline"
              disabled={isPending || isUploadingImageLoading || isLoading}
            >
              {quizzData ? "Edit" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
