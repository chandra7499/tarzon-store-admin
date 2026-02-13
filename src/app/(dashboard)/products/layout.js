// app/updates/layout.js
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/firebaseAdmin";
import axios from "axios";
export const runtime = "nodejs";

export default async function UpdatesLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  // No cookie → login
  if (!token) {
    redirect("/login");
  }

  let decoded;

  try {
    // 🔐 Verify token (this can THROW)
    decoded = await getAdmin().auth().verifyIdToken(token);
  } catch (error) {
    // 🔥 Token expired / invalid → force logout
    console.log("Token verification failed:", error.code);

    // Optional: clear cookie
    await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`);
  }

  // Fetch admin
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

  // 🔐 Permission check
  const hasPermission =
    admin.role === "superadmin" || admin.permissions?.includes("edit_products");

  if (!hasPermission) {
    redirect("/");
  }

  return children;
}
