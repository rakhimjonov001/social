"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui";
import { 
  ResponsiveContainer, PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend 
} from "recharts";
import { motion } from "framer-motion";


interface ActivityItem {
  name: string;
  posts: number;
  comments: number;
  likes: number;

  [key: string]: string | number; 
}

interface RoleStat {
  name: string;
  value: number;
  color: string;
  
  [key: string]: string | number;
}

interface AnalyticsDashboardProps {
  roleStats: RoleStat[];
  activityData: ActivityItem[];
}

export function AnalyticsDashboard({ roleStats, activityData }: AnalyticsDashboardProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Распределение ролей (Pie Chart) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="h-full bg-card/50 backdrop-blur-md border-border">
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Breakdown of users by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {roleStats.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke="transparent"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px" 
                    }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Активность за неделю (Bar Chart) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="h-full bg-card/50 backdrop-blur-md border-border">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Metrics from the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    fontSize={12} 
                    stroke="hsl(var(--muted-foreground))"
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    fontSize={12} 
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip 
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px" 
                    }}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="posts" name="Posts" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="comments" name="Comments" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="likes" name="Likes" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}