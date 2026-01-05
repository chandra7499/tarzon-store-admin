export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/firebaseAdmin";
const admin = getAdmin();

export async function GET() {
  try {
    const snapshot = await admin.firestore().collection("userFeedBacks").get();
    
    if (snapshot.empty) {
      return NextResponse.json({ success: false }, { status: 404 });
    }

    const data = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const docData = doc.data();
        
        const processedFeedBacks = await Promise.all(
          docData.feedBacks.map(async (feedback) => {
            const userDoc = await feedback.name.get();
            const userData = userDoc.data();
            
            // Return clean object with resolved name
            return {
              id: feedback.id,
              email: feedback.email,
              feedback: feedback.feedback,
              response: feedback.response,
              timestamp: new Date(feedback.timestamp.seconds * 1000 + feedback.timestamp.nanoseconds / 1000000).toISOString().slice(0, 10),
              userName: userData?.Name || userData?.name || 'Unknown' // Add resolved name as new field
            };
          })
        );

        return {
          id: doc.id,
          feedBacks: processedFeedBacks,
        };
      })
    );

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}