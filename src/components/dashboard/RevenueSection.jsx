"use client";
import { Card, CardContent } from "@/components/ui/card";

const RevenueSection = () => {
  const revenue = {
    total: "₹4,56,000",
    growth: "+12.4%",
  };

  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-2">💰 Revenue Overview</h2>
        <p className="text-3xl font-bold">{revenue.total}</p>
        <p className="text-green-600 mt-1 font-medium">{revenue.growth} this month</p>
      </CardContent>
    </Card>
  );
};

export default RevenueSection;
