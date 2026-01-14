// app/api/auth/me/route.js
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export async function GET(req) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) {
    console.log("No token");
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const decoded = await getAdmin().auth().verifyIdToken(token);

    const snapshot = await getAdmin()
      .firestore()
      .collection("admins")
      .where("email", "==", decoded.email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ authenticated: false }, { status: 403 });
    }

    return NextResponse.json({
      authenticated: true,
      admin: snapshot.docs[0].data(),
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
