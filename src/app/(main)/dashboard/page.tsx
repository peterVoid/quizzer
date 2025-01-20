import { checkUserHasOnboarding } from "@/lib/checkUserHasOnboarding";
import { Metadata } from "next";
import { SearchBarWithCategory } from "./SearchBarWithCategory";
import { RecentActivity } from "./RecentActivity";
import { QuizzForYou } from "./QuizzForYou";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Page() {
  const session = await checkUserHasOnboarding();

  return (
    <div>
      <SearchBarWithCategory />
      <div className="space-y-10 p-10">
        <RecentActivity />
        <QuizzForYou />
      </div>
    </div>
  );
}
