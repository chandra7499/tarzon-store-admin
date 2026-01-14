// src/proxy.js
import { NextResponse } from "next/server";

export function proxy(req) {
  const token = req.cookies.get("admin_token")?.value;
  const { pathname } = req.nextUrl;

  // Always allow APIs
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Allow Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname === "/favicon.ico" ||
    pathname.match(/\.(png|jpg|jpeg|svg|webp)$/)
  ) {
    return NextResponse.next();
  }

  // Allow public pages
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // Protect everything else
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/orders/:path*",
    "/products/:path*",
    "/settings/:path*",
  ],
};
