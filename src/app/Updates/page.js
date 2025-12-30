import React from 'react'
import TrendingCarosel from "@/components/Updates/trendingCarosel";
import OfferZone from "@/components/Updates/offerZone";
import NewPolices from "@/components/Updates/newPolicies";
import SideBar from "@/components/SideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";


export const metadata = {
    title: "Updates",
    description: "Offers",
}
const UpdatesPage = () => {
  return (
    <>
      <SidebarProvider>
        {<SideBar />}
        {<SidebarTrigger className="cursor-pointer sticky top-1" />}
        <section className="flex flex-col w-full">
         <TrendingCarosel />
         <OfferZone />
         <NewPolices />
         </section>
      </SidebarProvider>

    </>
  )
}

export default UpdatesPage