import { AppSidebar } from "@/components/app-sidebar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="absolute right-1 top-1">
        <ThemeSwitcher />
      </div>
      <main className="p-10 md:p-14">{children}</main>
    </SidebarProvider>
  );
}
