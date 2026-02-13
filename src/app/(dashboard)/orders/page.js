import Orders from "@/components/orders/orders";
// import SideBar from "@/components/SideBar";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const metadata = {
  title: "Orders",
  description: "Orders",
};

export default function Orderspage() {
  return (
    <>
      {/* <SidebarProvider>
        {<SideBar />}
        {<SidebarTrigger className="cursor-pointer sticky top-1" />} */}
        <section className="flex flex-col w-full p-6">
        <Orders />
        </section>
      {/* </SidebarProvider> */}
    </>
  );
}
