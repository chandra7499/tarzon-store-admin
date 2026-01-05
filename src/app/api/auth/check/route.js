// app/api/auth/check/route.js
import { NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/lib/firebaseAdmin";

export async function GET(req) {
  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const decoded = await verifyFirebaseToken(token);
    return NextResponse.json({ authenticated: true, user: decoded });
  } catch (error) {
    console.error("Check auth error:", error);
    return NextResponse.json({ authenticated: false });
  }
}
