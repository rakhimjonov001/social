import { getSuggestedUsers } from "@/actions/users";
import { SidebarClient } from "./sidebar-client";

export async function Sidebar() {
  const suggestedUsers = await getSuggestedUsers(5);

  return <SidebarClient suggestedUsers={suggestedUsers} />;
}
