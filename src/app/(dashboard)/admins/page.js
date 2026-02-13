import AdminsView from "@/components/admins/adminsList";
// import SideBar from "@/components/SideBar";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const metadata = {
  title: "Admins",
  description: "Admins",
};
const Adminspage = () => {
  return (
    <>
      {/* <SidebarProvider>
        {<SideBar />}
        {<SidebarTrigger className="cursor-pointer sticky top-1" />} */}
        <section className="flex flex-col w-full p-2">
          <AdminsView />
        </section>
      {/* </SidebarProvider> */}
    </>
  );
};

export default Adminspage;
