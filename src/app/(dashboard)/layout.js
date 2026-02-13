import SideBar from "@/components/SideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex w-full">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <SideBar />

          <main className="flex w-full">
            <SidebarTrigger className="sticky top-1 cursor-pointer" />
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
