import SideBar from "@/components/SideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-hidden">
        <SideBar />

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-x-hidden">
          <SidebarTrigger className="sticky top-2 ml-2 cursor-pointer" />

          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}