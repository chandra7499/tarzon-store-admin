import TrendingCarousel from "@/components/dashboard/TrendingCarousel";
import RevenueSection from "@/components/dashboard/RevenueSection";
import UserVisitedGraph from "@/components/dashboard/UserVisitedGraph";
import MonthlyNewUsers from "@/components/dashboard/MonthlyNewUsers";
import DailyTraffic from "@/components/dashboard/DailyTraffic";
import OfferZone from "@/components/dashboard/OfferZone";
import SideBar from "@/components/SideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";



export const metadata = {
  title: "Dashboard",
  description: "Dashboard",
};



export default function DashboardPage() {

  return (
    <SidebarProvider>
      {<SideBar />}
      {<SidebarTrigger className="cursor-pointer sticky top-1" />}

      <div className="p-3  space-y-6 flex-1 justify-center">
       
          <TrendingCarousel  />
       

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <RevenueSection />
          <UserVisitedGraph />
          <OfferZone />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <MonthlyNewUsers />
          <DailyTraffic />
        </div>
      </div>
    </SidebarProvider>
  );
}
