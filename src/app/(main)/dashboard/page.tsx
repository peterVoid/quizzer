import { checkUserHasOnboarding } from "@/lib/checkUserHasOnboarding";

export default async function Page() {
  const session = await checkUserHasOnboarding();

  return <div>Dashboard Page</div>;
}
