/**
 * User Growth Chart Component
 * 
 * Chart showing user growth over time using Recharts
 */

"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface GrowthData {
  month: string;
  users: number;
}

export function UserGrowthChart({ data }: { data: GrowthData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="month"
            className="text-xs"
            tickFormatter={(value) => {
              const date = new Date(value + "-01");
              return date.toLocaleDateString("en-US", { month: "short" });
            }}
          />
          <YAxis className="text-xs" />
          <Tooltip
            labelFormatter={(value) => {
              const date = new Date(value + "-01");
              return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
            }}
            formatter={(value) => [value, "New Users"]}
          />
          <Line
            type="monotone"
            dataKey="users"
            // Используем переменную темы. Убедись, что в globals.css прописано --primary
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{
              fill: "hsl(var(--background))", // Внутрянка точки под цвет фона
              stroke: "hsl(var(--primary))",  // Ободок точки
              strokeWidth: 2,
              r: 4
            }}
            activeDot={{
              r: 6,
              stroke: "hsl(var(--primary))",
              strokeWidth: 2,
              fill: "hsl(var(--primary))"
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}