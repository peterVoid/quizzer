import { UserDashboardNavbar } from "./UserDashboardNavbar";
import { UserDashboardSidbear } from "./UserDashboardSidebar";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className="flex w-full">
        <div className="hidden md:block">
          <UserDashboardSidbear />
        </div>
        <div className="w-full min-w-0">
          <UserDashboardNavbar />
          {children}
        </div>
      </div>
    </main>
  );
}
