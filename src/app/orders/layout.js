// app/updates/layout.js
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

export default async function UpdatesLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  // Not logged in
  if (!token) {
    redirect("/login");
  }

  // Verify token
  const decoded = await getAdmin().auth().verifyIdToken(token);

  // Fetch admin from Firestore
  const snapshot = await getAdmin()
    .firestore()
    .collection("admins")
    .where("email", "==", decoded.email)
    .limit(1)
    .get();

  if (snapshot.empty) {
    redirect("/login");
  }

  const admin = snapshot.docs[0].data();

  // 🔐 PERMISSION CHECK FOR UPDATES
  const hasPermission =
    admin.role === "superadmin" || admin.permissions?.includes("manage_orders");

  if (!hasPermission) {
    redirect("/");
  }

  // Authorized → render page
  return children;
}
