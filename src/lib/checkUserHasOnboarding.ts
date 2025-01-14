import { redirect } from "next/navigation";
import { getAuthSession } from "./auth";

export const checkUserHasOnboarding = async () => {
  const session = await getAuthSession();

  if (session && !session.user.onboarded) {
    return redirect("/onboarding");
  }

  return session;
};
