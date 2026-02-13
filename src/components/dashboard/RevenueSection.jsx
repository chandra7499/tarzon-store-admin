"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { handleTotalRevenue } from "@/functions/handleAdmins";

const RevenueSection = () => {
  const [revenue, setRevenue] = useState({
    total: 0,
    online: 0,
    cod: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRevenue() {
      try {
        setLoading(true);

        const res = await handleTotalRevenue();

        if (!res?.success) return;

        setRevenue(res.revenue);
      } catch (error) {
        console.error("Revenue fetch failed:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRevenue();
  }, []);

  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-2">💰 Revenue Overview</h2>

        {loading ? (
          <p className="text-gray-400">Fetching revenue...</p>
        ) : (
          <>
            <p className="text-3xl font-bold">
              ₹ {revenue.total.toLocaleString("en-IN")}
            </p>

            <div className="text-sm text-gray-500 mt-2 space-y-1">
              <p>Online: ₹ {revenue.online.toLocaleString("en-IN")}</p>
              <p>COD: ₹ {revenue.cod.toLocaleString("en-IN")}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueSection;
