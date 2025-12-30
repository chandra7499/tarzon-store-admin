import Form from "@/components/NewProductForm"
import SideBar from "@/components/SideBar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export const metadata = {
    title: "New Product form",
    description: "create a new Product",
}
const newproduct = () => {
  return (
    <>
      <SidebarProvider>
        {<SideBar />}
        {<SidebarTrigger className="cursor-pointer sticky top-1" />}
       <main className="w-full">
         <Form />
       </main>
      </SidebarProvider>
    </>
  )
}

export default newproduct