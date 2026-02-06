/**
 * Settings Page
 * 
 * User profile settings and account management
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCurrentUser } from "@/actions/users";
import { SettingsForm } from "./settings-form";

export const metadata = {
  title: "Settings | Social",
  description: "Manage your account settings",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return <SettingsForm user={user} />;
}