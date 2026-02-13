import { SearchEngine } from "../../../components/searchEngine/searchEngine";
// import SideBar from "@/components/SideBar";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const metadata = {
  title: "Search Engine Updation",
  description: "Client thirty party updation",
};

export default function SearchEngineUpdation() {
  return (
    <>
      {/* <SidebarProvider>
        {<SideBar />}
        {<SidebarTrigger className="cursor-pointer sticky top-1" />} */}
          <section className="flex flex-col w-full p-6"> 
           <SearchEngine />
           </section>
        {/* </SidebarProvider> */}
    </>
  );
}
