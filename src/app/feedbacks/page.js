import React from "react";
import FeedBacks from "../../components/FeedBacks/FeedBackView";
import SideBar from "../../components/SideBar";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";

export const metadata = {
  title: "Feedbacks",
  description: "Feedbacks",
};

const FeedBackPage = () => {
  return (
    <>
      <SidebarProvider>
        {<SideBar />}
        {<SidebarTrigger className="cursor-pointer sticky top-1" />}
        <FeedBacks />
      </SidebarProvider>
    </>
  );
};

export default FeedBackPage;
