"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Image from "next/image";

import { handleLogout } from "@/functions/handleAdminAuth";
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
import { Spinner } from "./ui/spinner";

import {
  Home,
  Package,
  Pencil,
  MessageSquareWarning,
  ShoppingCart,
  Users,
  GraduationCap,
  LogOut,
} from "lucide-react";

/* =========================
   SIDEBAR COMPONENT
========================= */

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { open } = useSidebar();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const admin = useSelector((state) => state.admin?.admin);

  /* =========================
     PERMISSION HELPERS
  ========================= */

  const normalizePermission = (perm) => {
    if (!perm) return perm;
    if (perm === "managesAdmins") return "manage_admins";
    return perm;
  };

  /**
   * Rule:
   * - superadmin → allow everything
   * - others → permission-based
   */
  const canAccess = (requiredPermission) => {
    if (!admin) return false;

    // 🔓 Superadmin bypass
    if (admin.role === "superadmin") return true;

    // 🌐 Public route (Dashboard)
    if (!requiredPermission) return true;

    const permissions = admin.permissions?.map(normalizePermission) || [];

    return permissions.includes(requiredPermission);
  };

  /* =========================
     MENU CONFIG
  ========================= */

  const items = [
    {
      label: "Dashboard",
      path: "/",
      icon: Home,
      permission: null,
    },
    {
      label: "Products",
      path: "/products",
      icon: Package,
      permission: "view_products",
    },
    {
      label: "Updates",
      path: "/Updates",
      icon: Pencil,
      permission: "updates",
    },
    {
      label: "Feedbacks",
      path: "/feedbacks",
      icon: MessageSquareWarning,
      permission: "manage_feedbacks",
    },
    {
      label: "Manage Orders",
      path: "/orders",
      icon: ShoppingCart,
      permission: "manage_orders",
    },
    {
      label: "Manage Users",
      path: "/users",
      icon: Users,
      permission: "manage_users",
    },
    {
      label: "Manage Admins",
      path: "/admins",
      icon: GraduationCap,
      permission: "manage_admins",
    },
  ];

  /* =========================
     FETCH ADMIN (REHYDRATE)
  ========================= */

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const res = await fetch("/api/auth/check/me", {
          credentials: "include",
        });

        const data = await res.json();

        if (data?.authenticated) {
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

  /* =========================
     LOGOUT
  ========================= */

  const onLogout = async () => {
    try {
      setLoading(true);
      await handleLogout(dispatch, router);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <Sidebar collapsible="icon" className="h-screen bg-white border-r">
      {/* ===== HEADER ===== */}
      <SidebarHeader className="flex items-center gap-3 p-4 border-b">
        <div className="w-9 h-9 shrink-0">
          <Image
            src={admin?.profile || "/vercel.svg"}
            width={36}
            height={36}
            alt="Admin"
            className="w-9 h-9 rounded-full object-cover"
          />
        </div>

        {open && (
          <div className="flex flex-col">
            <span className="font-semibold">{admin?.name || "Admin"}</span>
            <span className="text-xs text-gray-500">{admin?.role}</span>
          </div>
        )}
      </SidebarHeader>

      {/* ===== MENU ===== */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items
                .filter((item) => canAccess(item.permission))
                .map((item) => {
                  const isActive =
                    item.path === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.path);

                  return (
                    <SidebarMenuItem key={item.path}>
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
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ===== FOOTER ===== */}
      <SidebarFooter className="border-t p-3">
        {!loading ? (
          <Button
            size="sm"
            onClick={onLogout}
            variant="ghost"
            className="w-full justify-start text-red-500"
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
