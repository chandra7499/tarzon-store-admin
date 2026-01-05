import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "No token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const adminApp = getAdmin();

    // 1️⃣ Verify Firebase ID token
    const decoded = await adminApp.auth().verifyIdToken(token);
    console.log(decoded);

    // 2️⃣ Find admin by EMAIL (✅ correct for your DB)
    const snapshot = await adminApp
      .firestore()
      .collection("admins")
      .where("email", "==", decoded.email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, message: "Not an admin" },
        { status: 403 }
      );
    }

    const adminData = snapshot.docs[0].data();

    if (adminData.status !== "active") {
      return NextResponse.json(
        { success: false, message: "Admin disabled" },
        { status: 403 }
      );
    }

    // 3️⃣ Success response
    const response = NextResponse.json({
      success: true,
      admin: {
        email: decoded.email,
        role: adminData.role,
        name: adminData.name,
        id: adminData.id,
        profile: adminData.profile,
        fullName: adminData.fullName,
        permissions: adminData.permissions || [],
      },
    });

    // 4️⃣ Set secure cookie
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 }
    );
  }
}
