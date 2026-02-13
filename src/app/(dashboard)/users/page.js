import UserView from "@/components/userView/userViews";
// import SideBar from "@/components/SideBar";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const metadata = {
  title: "Users",
  description: "Users",
};
const UserPage = () => {
  return (
    <>
      {/* <SidebarProvider>
        {<SideBar />}
        {<SidebarTrigger className="cursor-pointer sticky top-1" />} */}
        <section className="flex flex-col w-full">
        <UserView />
        </section>
      {/* </SidebarProvider> */}
    </>
  );
};

export default UserPage;
