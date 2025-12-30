// middleware.js (at project root)
import { NextResponse } from "next/server";

export function proxy(req) {
  const token = req.cookies.get("tarzon_admin_token")?.value; // Make sure to get .value

  // List of public routes (don’t redirect these)
  const publicPaths = ["/login", "/api/auth/login","","/api/auth/forgetpassword"];
  if (publicPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  

  if (token === "expired") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Otherwise, allow access
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)", // protect all except static assets
};
