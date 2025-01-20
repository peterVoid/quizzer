"use client";

import { Button } from "@/components/ui/button";
import { Home, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const UserDashboardSidebarLinks = [
  {
    title: "Explore",
    url: "/dashboard",
    icon: Home,
  },
];

export function UserDashboardSidbear() {
  const pathname = usePathname();

  if (pathname.includes(`/dashboard/activity`)) {
    return;
  }

  return (
    <aside className="border-r border-muted">
      <div className="h-screen w-60 space-y-3 p-3">
        <h1 className="text-2xl font-bold uppercase">Quizzer</h1>
        <Button className="text-md w-full font-semibold">
          <Plus />
          Create
        </Button>
        <div className="flex flex-col gap-4">
          {UserDashboardSidebarLinks.map((item, index) => (
            <Link
              href={item.url}
              key={index}
              className={`flex items-center gap-2 rounded-md p-2 ${item.url === pathname ? "bg-purple-500/20" : ""}`}
            >
              <item.icon size={18} />
              <p className="text-sm font-normal">{item.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
