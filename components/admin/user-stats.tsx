"use client";

import { Users, FileText, Heart, MessageSquare, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { motion } from "framer-motion";

interface UserStatsProps {
  initialStats: {
    totalUsers: number;
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    newUsersThisMonth: number;
    newPostsThisMonth: number;
    newLikesThisMonth: number;
    newCommentsThisMonth: number;
  };
}

export function UserStats({ initialStats }: UserStatsProps) {
  const statsConfig = [
    {
      title: "Total Users",
      value: initialStats.totalUsers,
      subValue: initialStats.newUsersThisMonth,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Total Posts",
      value: initialStats.totalPosts,
      subValue: initialStats.newPostsThisMonth,
      icon: FileText,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Total Likes",
      value: initialStats.totalLikes,
      subValue: initialStats.newLikesThisMonth,
      icon: Heart,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {statsConfig.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4 }}
        >
          <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-xl shadow-sm transition-all hover:shadow-md hover:border-primary/20 group">
            {/* Декоративное свечение при наведении */}
            <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity ${stat.bg}`} />
            
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold tracking-tight text-muted-foreground uppercase">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-black tracking-tight text-foreground">
                  {initialStats.totalUsers > 0 ? stat.value.toLocaleString() : "0"}
                </div>
                <div className={`flex items-center text-xs font-bold ${stat.color}`}>
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                  {stat.subValue}
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-2">
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <motion.div 
                    className={`h-full ${stat.color.replace('text', 'bg')}`}
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }} // Здесь можно высчитать реальный %
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                  Goal 100%
                </span>
              </div>
              
              <p className="mt-2 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-tighter">
                Activity this month
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}