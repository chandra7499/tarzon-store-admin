export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/firebaseAdmin";
import NodeCache from "node-cache";

const admin = getAdmin();
const cache = new NodeCache({ stdTTL: 5 }); // cache for 60s

export async function GET() {
  try {
    // 2️⃣ Fetch from Firestore
    const snap = await admin.firestore().collection("user").get();

    const data = snap.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((u) => u.orderStatus != null)
      .map((u) => ({
        id: u.id,
        status: u.orderStatus,
      }));

    // 3️⃣ Store in cache
    // 4️⃣ Return JSON
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
