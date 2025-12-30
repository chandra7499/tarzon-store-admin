// api/admins
import { NextResponse } from "next/server";
import { admin } from "@/lib/firebaseAdmin";

export async function GET() {
    try {
        const adminsData = await admin.firestore().collection("admins").get();
        const data = adminsData.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        const adminInfo = data.map((admin) => ({
            id: admin.id,
            name: admin.fullName,
            email: admin.email || admin.Email || "",
            avatar: admin.profile || admin.avatar || "",
            role: admin.role || "",
            status: admin.status || "",
        }))
        return NextResponse.json({ success: true, adminInfo });
    } catch (error) {
        return NextResponse.json({ success: false, error });
    }
}