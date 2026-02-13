"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", users: 400 },
  { month: "Feb", users: 600 },
  { month: "Mar", users: 800 },
  { month: "Apr", users: 500 },
  { month: "May", users: 900 },
  { month: "Jun", users: 700 },
];

const MonthlyNewUsers = () => (
  <Card className="shadow-md">
    <CardContent className="p-4">
      <h2 className="text-xl font-semibold mb-2">👥 Monthly New Users</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#e5e7eb",
            }}
          />
          <Bar dataKey="users" fill="#22c55e" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default MonthlyNewUsers;
