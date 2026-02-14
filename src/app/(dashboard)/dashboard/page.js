import TrendingCarousel from "@/components/dashboard/TrendingCarousel";
import RevenueSection from "@/components/dashboard/RevenueSection";
import UserVisitedGraph from "@/components/dashboard/UserVisitedGraph";
import MonthlyNewUsers from "@/components/dashboard/MonthlyNewUsers";
import DailyTraffic from "@/components/dashboard/DailyTraffic";
import OfferZone from "@/components/dashboard/OfferZone";
import BrandScroll from "@/components/Updates/brandscroll";
// import SideBar from "@/components/SideBar";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 flex-1 w-full min-w-0 overflow-x-hidden">
      <TrendingCarousel />
      <BrandScroll />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0">
        <RevenueSection />
        <UserVisitedGraph />
        <OfferZone />
      </div>

      <div className="grid md:grid-cols-2 gap-4 min-w-0">
        <MonthlyNewUsers />
        <DailyTraffic />
      </div>
    </div>
  );
}
