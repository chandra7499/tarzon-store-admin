import { NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/lib/firebaseAdmin";

export async function middleware(req) {
  const cookie = req.headers.get("cookie");
  const tokenMatch = cookie?.match(/admin_token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;

  const url = req.nextUrl.clone();

  // If no token, redirect to login
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    const decoded = await verifyFirebaseToken(token);
    const role = decoded.role;

    // Allow only admins
    if (role !== "admin" && role !== "superadmin") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // ✅ Allow the request to continue
    return NextResponse.next();

  } catch (err) {
    console.error("Middleware auth error:", err.message);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}




export const config = {
  matcher: [
    "/orders:path*",
    "/products/:path*",
    "/settings/:path*",
    "/api/admin/:path*"
  ],
};