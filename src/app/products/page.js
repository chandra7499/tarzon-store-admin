import Products from "@/components/Products";
import SideBar from "../../components/SideBar";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import Link from "next/link";

export const metadata = {
  title: "Products",
  description: "Products",
};



async function Productspage() {

  return (
    <>
      <SidebarProvider>
        {<SideBar />}
        {<SidebarTrigger className="cursor-pointer sticky top-1" />}
        <section className="flex flex-col w-full   h-screen">
          <div className="flex   w-full gap-3  justify-between items-center sticky top-0 p-5 border-b border-b-gray-500/40 bg-slate-950">
            <h1 className="flex text-white font-semibold text-2xl antialiased tracking-wider">
              Products
            </h1>

            <Link
              href="/products/new"
              className="rounded-lg ring-1 ring-white/20 text-white w-max font-sans p-3 hover:bg-gray-500/20"
            >
              Add New Product
            </Link>
          </div>
          <div className="flex  overflow-y-auto  flex-col ">
            <Products />
          </div>
        </section>
      </SidebarProvider>
    </>
  );
}

export default Productspage;
