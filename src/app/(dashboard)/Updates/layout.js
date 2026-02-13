// app/Updates/layout.js
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/firebaseAdmin";
import { handleLogout } from "@/functions/handleAdminAuth";

export const runtime = "nodejs";

export default async function UpdatesLayout({ children }) {
  const cookieStore = await cookies();
  const token =  cookieStore.get("admin_token")?.value;

  // ❌ No token
  if (!token) {
    redirect("/login");
  }

  let decoded;

  try {
    // ✅ Verify token
    decoded = await getAdmin().auth().verifyIdToken(token);
  } catch (err) {
    console.log("Token verification failed:", err.code);

    // 🔥 Token expired / invalid → force login
    redirect("/login");
    
  }

  // ✅ Fetch admin
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

  // 🔐 Permission check
  const hasPermission =
    admin.role === "superadmin" ||
    admin.permissions?.includes("updates");

  if (!hasPermission) {
    redirect("/");
  }

  return children;
}
