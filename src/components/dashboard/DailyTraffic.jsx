"use client";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", traffic: 1200 },
  { day: "Tue", traffic: 1500 },
  { day: "Wed", traffic: 1000 },
  { day: "Thu", traffic: 1800 },
  { day: "Fri", traffic: 2000 },
  { day: "Sat", traffic: 2400 },
  { day: "Sun", traffic: 1700 },
];

const DailyTraffic = () => (
  <Card className="shadow-md">
    <CardContent className="p-4">
      <h2 className="text-xl font-semibold mb-2">🚦 Daily Traffic</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="traffic" stroke="#f59e0b" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default DailyTraffic;
