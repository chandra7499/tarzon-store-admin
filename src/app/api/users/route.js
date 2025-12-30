// api/users/routes.js

import { NextResponse } from "next/server";
import { admin } from "@/lib/firebaseAdmin";

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
            role: user.role || "",
          }));
        
        return NextResponse.json({ success: true, userInfo});
    } catch (error) {
        return NextResponse.json({ success: false, error });
    }
}