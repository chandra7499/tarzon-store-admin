"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { handleLogout } from "@/functions/handleAdminAuth";
import { useDispatch } from "react-redux";
import { useState, useEffect} from "react";
import { useSelector } from "react-redux";
import {setAdmin} from "@/Global_States/adminSlice";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"; // ✅ path simplified if using alias @
import { Button } from "@/components/ui/button";
import {
  Package,
  Users,
  ShoppingCart,
  GraduationCap,
  Home,
  Pencil,
  MessageSquareWarning,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { Spinner } from "./ui/spinner";



const SideBar = () => {
  const pathname = usePathname();
  const { open } = useSidebar();
  const dispatch = useDispatch();
  const router = useRouter();
  const [Loading, setLoading] = useState(false);
  const adminState = useSelector((state) => state.admin);
  const admin = adminState?.admin;
 
  // const admin = useSelector((state) => state.admin?.isAuthenticated);
  // const router = useRouter();

  const items = [
    { operation: "Dashboard", path: "/", icon: Home },
    { operation: "Products", path: "/products", icon: Package },
    { operation: "Updates", path: "/Updates", icon: Pencil },
    { operation: "Manage Orders", path: "/orders", icon: ShoppingCart },
    { operation: "Manage Users", path: "/users", icon: Users },
    { operation: "FeedBacks", path: "/feedbacks", icon: MessageSquareWarning },
    { operation: "Manage Admins", path: "/admins", icon: GraduationCap },
  ];

  
 useEffect(() => {
  async function fetchAdmin() {
    try {
      const res = await fetch("/api/auth/check/me", {
        credentials: "include",
      });

      const data = await res.json();
      console.log("ME API:", data);

      if (data.authenticated) {
        dispatch(
          setAdmin({
            admin: data.admin,
            isAuthenticated: true,
          })
        );
      }
    } catch (err) {
      console.error("Fetch admin failed:", err);
    }
  }

  fetchAdmin();
}, [dispatch]);



console.log("admin",admin);
  async function handleLoginState() {
    try {
      setLoading(true);
      await handleLogout(dispatch, router);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }


  return (
    <Sidebar
      collapsible="icon"
      className="h-screen bg-white border-r transition-normal duration-300  border-gray-200 text-gray-900 shadow-sm"
    >
      {/* Header */}
      <SidebarHeader className="flex items-center gap-3 p-4 border-b shrink-0 border-gray-100">
        <Image
          src={admin?.profile || "/vercel.svg"}
          width={35}
          height={30}
          className={clsx(
            `rounded-full object-cover  p-1 ${
              !open && "lg:scale-[2.0]"
            } scale-[1.5]  transition-all  duration-100 rounded-full shadow-inner shadow-slate-800`
          )}
          alt="Logo"
          priority
        />
        {open && (
          <span className="font-semibold text-lg truncate  overflow-hidden flex shrink-0 w-full justify-center">
            Tarzon Admin
          </span>
        )}
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="flex-1  mt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive =
                  item.path === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.path);

                return (
                  <SidebarMenuItem key={item.operation}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.operation}
                      className={clsx(
                        "group flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm transition-all  duration-200 hover:bg-gray-100",
                        isActive
                          ? "bg-gray-900 text-white hover:bg-gray-800"
                          : "hover:bg-gray-500 hover:text-white"
                      )}
                    >
                      <Link
                        href={item.path}
                        className="flex items-center gap-3 h-full w-full hover:text-white"
                      >
                        <item.icon
                          className={clsx(
                            "shrink-0",
                            isActive ? "text-white" : "text-gray-700 "
                          )}
                        />
                        <span className="truncate ">{item.operation}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-gray-200  overflow-hidden flex justify-between w-full">
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-2">
            <Image
              src={"/vercel.svg"}
              width={32}
              height={32}
              alt="User"
              className="rounded-full"
            />
          </div>
          {!Loading ? <Button
            size="sm"
            onClick={() => handleLoginState()}
            variant="ghost"
            className="text-gray-600 cursor-pointer hover:text-red-500 hover:bg-transparent"
          >
           
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button> :  <Spinner show={Loading} />}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideBar;
