import { ThemeSwitcher } from "@/components/theme-switcher";
import { getAuthSession } from "@/lib/auth";
import { OnboardingFormProvider } from "../context/OnboardingFormContext";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (session?.user.onboarded) {
    return redirect("/");
  }

  return (
    <OnboardingFormProvider session={session!}>
      <main className="flex min-h-screen w-full items-center justify-center">
        <div className="absolute right-2 top-1">
          <ThemeSwitcher />
        </div>
        {children}
      </main>
    </OnboardingFormProvider>
  );
}
