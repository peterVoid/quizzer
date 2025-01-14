import { ThemeSwitcher } from "@/components/theme-switcher";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      <div className="absolute right-1 top-1">
        <ThemeSwitcher />
      </div>
      {children}
    </main>
  );
}
