// api/auth/login/route.js
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/firebaseAdmin";

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Missing token" },
        { status: 401 }
      );
    }

    const idToken = authHeader.split("Bearer ")[1];

    const admin = getAdmin();

    // ✅ Verify token (SERVER SAFE)
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const email = decodedToken.email;

    // ✅ Check admin in Firestore
    const adminSnap = await admin
      .firestore()
      .collection("admins")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (adminSnap.empty) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 403 }
      );
    }

    const adminData = adminSnap.docs[0].data();

    if (adminData.status !== "active") {
      return NextResponse.json(
        { success: false, message: "Admin is inactive" },
        { status: 403 }
      );
    }

    const response = NextResponse.json({
      success: true,
      admin: {
        fullName: adminData.fullName,
        email: adminData.email,
        role: adminData.role,
        permissions: adminData.permissions,
      },
    });

    // ✅ Secure cookie
    response.cookies.set("tarzon_admin_token", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
}
