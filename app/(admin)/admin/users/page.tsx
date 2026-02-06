import { Suspense } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui";
import { UserManagement } from "@/components/admin/user-management";
import { UserStats } from "@/components/admin/user-stats";
import { getAdminUsers, getAdminStats } from "@/actions/admin";

export const metadata = {
  title: "User Management | Admin",
  description: "Manage users on the Social platform",
};

export default async function AdminUsersPage() {
  // Загружаем данные на сервере
  const [usersData, statsData] = await Promise.all([
    getAdminUsers(1, 20),
    getAdminStats()
  ]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage roles and monitor platform activity</p>
        </div>
        
        <Button className="shadow-sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      {/* User Stats */}
      <Suspense fallback={<div className="h-32 animate-pulse bg-muted rounded-lg" />}>
        <UserStats initialStats={statsData} />
      </Suspense>

      {/* User Management Table (Search inside) */}
      <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-lg" />}>
        <UserManagement initialData={usersData} />
      </Suspense>
    </div>
  );
}