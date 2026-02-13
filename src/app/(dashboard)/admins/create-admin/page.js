import React from "react";
import AdminForm from "../../../../components/admins/adminForm";
import SideBar from "../../../../components/SideBar";
import { SidebarProvider, SidebarTrigger } from "../../../../components/ui/sidebar";
export const metadata = {
  title: "Create Admin",
  description: "Create Admin",
};
const CreateAdminpage = () => {
  return (
    <div className="">
      <SidebarProvider>
        {<SideBar />}
        {<SidebarTrigger className="cursor-pointer sticky top-1" />}
        <section className="flex flex-col w-full justify-center h-screen">
          <AdminForm />
        </section>
      </SidebarProvider>
    </div>
  );
};

export default CreateAdminpage;
