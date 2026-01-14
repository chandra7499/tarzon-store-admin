"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { handleLogout } from "@/functions/handleAdminAuth";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { setAdmin } from "@/Global_States/adminSlice";

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
} from "@/components/ui/sidebar";

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
  const [loading, setLoading] = useState(false);

  const adminState = useSelector((state) => state.admin);
  const admin = adminState?.admin;

  /* ---------------- PERMISSION CHECK ---------------- */

  const normalizePermission = (perm) => {
    if (perm === "managesAdmins") return "manage_admins"; // temp fix
    return perm;
  };

  const hasPermission = (requiredPermission, requiredRole) => {
    if (!admin) return false;

    // 🔐 Role-level restriction
    if (requiredRole && admin.role !== requiredRole) {
      return false;
    }

    // Superadmin bypass (optional but recommended)
    if (admin.role === "superadmin") return true;

    // No permission required
    if (!requiredPermission) return true;

    const perms = admin.permissions?.map(normalizePermission) || [];
    return perms.includes(requiredPermission);
  };

  /* ---------------- MENU CONFIG ---------------- */

  const items = [
    {
      operation: "Dashboard",
      path: "/",
      icon: Home,
      permission: null,
    },
    {
      operation: "Products",
      path: "/products",
      icon: Package,
      permission: "view_products",
      role: "superadmin",
    },
    {
      operation: "Updates",
      path: "/updates",
      icon: Pencil,
      permission: "updates",
      role: "superadmin",
    },
    {
      operation: "feedbacks",
      path: "/feedbacks",
      icon: MessageSquareWarning,
      permission: "manage_feedbacks",
      role: "superadmin",
    },
    {
      operation: "Manage Orders",
      path: "/orders",
      icon: ShoppingCart,
      permission: "manage_orders",
      role: "superadmin",
    },
    {
      operation: "Manage Users",
      path: "/users",
      icon: Users,
      permission: "manage_users",
      role: "superadmin",
    },
    {
      operation: "Manage Admins",
      path: "/admins",
      icon: GraduationCap,
      permission: "manage_admins",
      role: "superadmin",
    },
  ];

  /* ---------------- FETCH ADMIN (REHYDRATE) ---------------- */

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const res = await fetch("/api/auth/check/me", {
          credentials: "include",
        });

        const data = await res.json();

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

  /* ---------------- LOGOUT ---------------- */

  async function handleLoginState() {
    try {
      setLoading(true);
      await handleLogout(dispatch, router);
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <Sidebar collapsible="icon" className="h-screen bg-white border-r">
      {/* Header */}
      <SidebarHeader className="flex items-center gap-3 p-4 border-b">
        <Image
          src={admin?.profile || "/vercel.svg"}
          width={36}
          height={36}
          alt="Admin"
          className="rounded-full object-cover"
        />
        {open && (
          <div className="flex flex-col">
            <span className="font-semibold">{admin?.name || "Admin"}</span>
            <span className="text-xs text-gray-500">{admin?.role}</span>
          </div>
        )}
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items
                .filter((item) => hasPermission(item.permission, item.role))
                .map((item) => {
                  const isActive =
                    item.path === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.path);

                  return (
                    <SidebarMenuItem key={item.operation}>
                      <SidebarMenuButton
                        asChild
                        className={clsx(
                          "flex items-center gap-3 px-3 py-2 rounded-md",
                          isActive
                            ? "bg-gray-900 text-white"
                            : "hover:bg-gray-200"
                        )}
                      >
                        <Link href={item.path}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.operation}</span>
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
      <SidebarFooter className="border-t p-3 overflow-hidden">
        {!loading ? (
          <Button
            size="sm"
            onClick={handleLoginState}
            variant="ghost"
            className="w-full justify-start cursor-pointer text-red-500"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        ) : (
          <Spinner show />
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideBar;
