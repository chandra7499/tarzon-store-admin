// api/users/routes.js
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/firebaseAdmin";
const admin = getAdmin();
export async function GET() {
    try {
        const usersData = await admin.firestore().collection("user").get();
        const data = usersData.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        const userInfo = data.map((user) => ({
            id: user.id,
            name: user.Name || user.name || "",
            Phone: user.Phone || user.phone || "",
            email: user.email || user.Email || "",
            avatar: user.profile || user.avatar || "",
            status: user.status || "",
            role: user.role || "",
          }));
        
        return NextResponse.json({ success: true, userInfo});
    } catch (error) {
        return NextResponse.json({ success: false, error });
    }
}