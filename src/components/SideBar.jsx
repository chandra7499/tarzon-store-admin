"use client";

import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

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

import {
  Home,
  Package,
  Pencil,
  MessageSquareWarning,
  ShoppingCart,
  Users,
  GraduationCap,
  Search,
  LogOut,
} from "lucide-react";

import { handleLogout } from "@/functions/handleAdminAuth";
import { setAdmin } from "@/Global_States/adminSlice";

/* =========================
   SIDEBAR
========================= */

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { open } = useSidebar();

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

  const canAccess = (permission) => {
    if (!admin) return false;
    if (admin.role === "superadmin") return true;
    if (!permission) return true;

    const perms = admin.permissions?.map(normalizePermission) || [];
    return perms.includes(permission);
  };

  /* =========================
     MENU CONFIG
  ========================= */

  const items = [
    { label: "Dashboard", path: "/dashboard", icon: Home },
    {
      label: "Products",
      path: "/products",
      icon: Package,
      permission: "view_products",
    },
    { label: "Updates", path: "/Updates", icon: Pencil, permission: "updates" },
    { label: "Search Engine", path: "/searchengineUpdation", icon: Search },
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
    let mounted = true;

    async function fetchAdmin() {
      try {
        const res = await fetch("/api/auth/check/me", {
          credentials: "include",
        });

        // 🔴 TOKEN INVALID / EXPIRED
        if (res.status === 401) {
          if (!mounted) return;

          await handleLogout(dispatch, router);
          return;
        }

        // 🔒 FORBIDDEN (not admin)
        if (res.status === 403) {
          if (!mounted) return;

          await handleLogout(dispatch, router);
          return;
        }

        const data = await res.json();

        if (data?.authenticated && mounted) {
          dispatch(
            setAdmin({
              admin: data.admin,
              isAuthenticated: true,
            }),
          );
        }
      } catch (err) {
        console.error("Admin fetch failed:", err);

        // 🚨 Network / unexpected error → safe logout
        if (mounted) {
          await handleLogout(dispatch, router);
        }
      }
    }

    fetchAdmin();

    return () => {
      mounted = false;
    };
  }, [dispatch, router]);

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
    <Sidebar collapsible="icon" className="h-screen bg-white border-r transition-all duration-200">
      {/* ===== HEADER ===== */}
      <SidebarHeader className="flex  items-center gap-3 p-4 border-b overflow-hidden">
        <div className={"w-12 h-12 shrink-0 flex items-center justify-center"}>
          <Image
            src={admin?.profile || "/vercel.svg"}
            width={36}
            height={36}
            alt="Admin"
            className="rounded-full object-cover w-10 h-10"
          />
        </div>
        {/* {open && ( */}
        <div
          className={clsx(
            "flex flex-col justify-center overflow-hidden transition-all duration-300 ease-in-out",
            open
              ? "opacity-100 max-w-40 ml-2"
              : "opacity-0 max-w-0 ml-0 h-0 pointer-events-none",
          )}
        >
          <span className="font-serif truncate">
            {admin?.name || "Tarzon-store"}
          </span>
          <span className="text-xs text-gray-500 truncate">{admin?.role}</span>
        </div>

        {/* )} */}
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
                      <Tooltip delayDuration={10} disableHoverableContent>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            className={clsx(
                              "flex items-center gap-3 px-3 py-2 rounded-md",
                              isActive
                                ? "bg-gray-900 text-white"
                                : "hover:bg-gray-600 hover:text-white",
                            )}
                          >
                            <Link href={item.path}>
                              <item.icon className="w-4 h-4 shrink-0" />
                              {open && <span>{item.label}</span>}
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>

                        {!open && (
                          <TooltipContent
                            side="right"
                            className="text-white"
                            sideOffset={8}
                          >
                            {item.label}
                          </TooltipContent>
                        )}
                      </Tooltip>
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
            variant="ghost"
            onClick={onLogout}
            className="w-full overflow-hidden justify-start text-red-500"
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
