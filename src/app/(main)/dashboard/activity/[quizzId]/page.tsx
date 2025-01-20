import { QuizzWork } from "./QuizzWork";

interface PageProps {
  params: Promise<{ quizzId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { quizzId } = await params;

  return <QuizzWork quizzId={quizzId} />;
}
