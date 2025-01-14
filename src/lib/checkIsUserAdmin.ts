import { redirect } from "next/navigation";
import { getAuthSession } from "./auth";

export const checkIsUserAdmin = async () => {
  const session = await getAuthSession();

  if (session && !session.user.isAdmin) {
    return redirect("/dashboard");
  }

  return session;
};
