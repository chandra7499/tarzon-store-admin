// src/app/api/auth/forgetPassword/route.js
import { sendResetEmail } from "../../../../lib/email.js";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/firebaseAdmin";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // 1️⃣ Check Firebase user exists
    try {
      await getAdmin().auth().getUserByEmail(email);
    } catch {
      return NextResponse.json(
        { success: false, message: "Email not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Check admin authorization
    const snapshot = await getAdmin()
      .firestore()
      .collection("admins")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, message: "You are not an authorized admin" },
        { status: 403 }
      );
    }

    // 3️⃣ Generate reset link
    const resetLink = await getAdmin().auth().generatePasswordResetLink(email);

    // ✅ SEND EMAIL
    await sendResetEmail(email, resetLink);

    return NextResponse.json({
      success: true,
      message: "Password reset link sent to your email",
    });

    // ⚠️ YOU MUST SEND EMAIL YOURSELF
    // Use nodemailer / sendgrid here

  } catch (error) {
    console.error("FORGET PASSWORD ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
