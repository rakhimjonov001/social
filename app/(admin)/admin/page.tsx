import { Suspense } from "react";
import { 
  Users, FileText, Heart, MessageCircle, 
  TrendingUp, Activity, LayoutDashboard 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";
import { RecentActivity } from "@/components/admin/recent-activity";
import { UserStats } from "@/components/admin/user-stats"; 
import { 
  getAdminStats, 
  getUserGrowthData, 
  getUserRoleStats, 
  getWeeklyActivity 
} from "@/actions/admin";

export const metadata = {
  title: "Dashboard | Admin Panel",
  description: "Overview of platform performance and user activity",
};

export default async function AdminDashboardPage() {
  // Загружаем все данные параллельно для максимальной скорости
  const [stats, growthData, roleStats, weeklyActivity] = await Promise.all([
    getAdminStats(),
    getUserGrowthData(),
    getUserRoleStats(),
    getWeeklyActivity()
  ]);

  return (
    <div className="space-y-8 pb-10">
      {/* Приветствие */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-primary font-semibold">
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-sm uppercase tracking-wider">Overview</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here is what&apos;s happening with your platform today.
        </p>
      </div>

      {/* Верхние карточки статистики (используем обновленный UserStats) */}
      <UserStats initialStats={stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Графики аналитики (занимают 2 колонки) */}
        <div className="lg:col-span-2 space-y-6">
          <AnalyticsDashboard 
            roleStats={roleStats} 
            activityData={weeklyActivity} 
          />
          
          {/* Дополнительный график роста пользователей */}
          <Card className="bg-card/50 backdrop-blur-md border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Monthly Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
               {/* Здесь можно вставить UserGrowthChart */}
               <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
                 График роста (в разработке)
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка: Последняя активность */}
        <div className="space-y-6">
          <Card className="h-full bg-card/50 backdrop-blur-md border-border/50 shadow-xl overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Suspense fallback={<ActivitySkeleton />}>
                <RecentActivity />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="p-4 space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
            <div className="h-2 w-1/4 bg-muted animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}