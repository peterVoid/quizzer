"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User2Icon } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface UserDropdownProps {
  name: string;
  email: string;
  profileImage: string | null;
}

export function UserDropdown({ email, name, profileImage }: UserDropdownProps) {
  const handleLogoutHandler = async () => {
    await signOut({
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/sign-in`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Image
          src={profileImage || ""}
          alt="Profile"
          width={25}
          height={25}
          className="size-8 rounded-full object-cover"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="space-y-2 p-3">
        <div className="flex items-center gap-2">
          <Image
            src={profileImage || ""}
            alt="Profile"
            width={25}
            height={25}
            className="size-8 rounded-full object-cover"
          />
          <div className="space-y-2">
            <p>{name}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="" className="flex items-center gap-2">
            <User2Icon className="size-4" />
            <p className="text-sm font-medium">View profile</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="" className="flex items-center gap-2">
            <Settings className="size-4" />
            <p className="text-sm font-medium">Settings</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={handleLogoutHandler}
        >
          <LogOut className="size-4" />
          <p className="text-sm font-medium">Logout</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
