import { Metadata } from "next";
import { AuthCard } from "../AuthCard";

export const metadata: Metadata = {
  title: "Sign-in",
};

export default function Page() {
  return <AuthCard isLoggedIn />;
}
