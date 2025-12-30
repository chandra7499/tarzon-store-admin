"use client";
import { Card, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", visits: 400 },
  { name: "Tue", visits: 800 },
  { name: "Wed", visits: 600 },
  { name: "Thu", visits: 1000 },
  { name: "Fri", visits: 850 },
  { name: "Sat", visits: 1200 },
  { name: "Sun", visits: 900 },
];

const UserVisitedGraph = () => {
  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-2">📈 User Visits</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="visitsColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area type="monotone" dataKey="visits" stroke="#2563eb" fillOpacity={1} fill="url(#visitsColor)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default UserVisitedGraph;
