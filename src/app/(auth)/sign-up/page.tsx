import { Metadata } from "next";
import { AuthCard } from "../AuthCard";

export const metadata: Metadata = {
  title: "Sign-up",
};

export default function Page() {
  return <AuthCard />;
}
