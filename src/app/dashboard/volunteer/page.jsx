"use client";
import { SectionCards } from "./components/section-cards";
import { AllUserTable } from "./components/data-table";
import { useEffect, useState } from "react";
import server from "@/lib/api";

export default function Page() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRequests: 0,
    totalFund: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await server.get("/api/stats/global-stats");
        setStats(response.data.data);
      } catch (err) {
        console.error("Stats fetch error:", err);
        setError("Failed to load statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards stats={stats} />

          <AllUserTable />
          <div className="px-4 lg:px-6">{/* <ChartAreaInteractive /> */}</div>
        </div>
      </div>
    </div>
  );
}
