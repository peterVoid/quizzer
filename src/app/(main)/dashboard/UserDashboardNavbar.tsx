import { ThemeSwitcher } from "@/components/theme-switcher";
import { getAuthSession } from "@/lib/auth";
import { UserDropdown } from "./UserDropdown";

export async function UserDashboardNavbar() {
  const session = await getAuthSession();

  return (
    <header className="flex h-14 w-full items-center justify-end border-b px-4 shadow-xl">
      <div className="flex items-center gap-2 px-2">
        <ThemeSwitcher />
        <UserDropdown
          email={session?.user.email!}
          name={session?.user.name!}
          profileImage={session?.user.image!}
        />
      </div>
    </header>
  );
}
