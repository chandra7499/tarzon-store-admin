// app/updates/layout.js
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

export default async function UpdatesLayout({ children }) {
  const cookieStore = await cookies();
  const token =  cookieStore.get("admin_token")?.value;

  // 🚫 No token → login
  if (!token) {
    redirect("/login");
  }

  let decoded;

  // 🔐 Verify token safely
  try {
    decoded = await getAdmin().auth().verifyIdToken(token);
  } catch (err) {
    console.log("Token verification failed:", err.code);
    redirect("/login");
  }

  // 🔎 Fetch admin from Firestore
  const snapshot = await getAdmin()
    .firestore()
    .collection("admins")
    .where("email", "==", decoded.email)
    .limit(1)
    .get();

  if (snapshot.empty) {
    cookieStore.delete("admin_token");
    redirect("/login");
  }

  const admin = snapshot.docs[0].data();

  // 🔐 PERMISSION CHECK (UPDATED)
  const hasPermission =
    admin.role === "superadmin" ||
    admin.permissions?.includes("manage_users");

  if (!hasPermission) {
    redirect("/");
  }

  // ✅ Authorized
  return children;
}
