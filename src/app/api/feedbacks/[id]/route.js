export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { admin } from "@/lib/firebaseAdmin";

export async function PUT(request, { params }) {
  try {
    const { replayText, docId } = await request.json();
    const { id } = await params;
    const feedBackRef = await admin
      .firestore()
      .collection("userFeedBacks")
      .doc(docId)
      .get();
    // console.log(feedBackRef.data());
    const feedBackData = feedBackRef.data();
    let isLimitReached = false;
    const responseData = feedBackData.feedBacks.map((item) => {
    
      if (item.id === id) {
        //response is === 3 then reached max replay limit  and replay a message to client why it fail

        if (item.response.length >= 3) {
           isLimitReached = true;
           return item;
        }
        return {

          ...item,
          response: [...item.response, replayText],
        };
      }
      return item;
    });
     if(isLimitReached){
      return NextResponse.json({ success: false, message: "Replay limit reached max 3" });
     }


    await feedBackRef.ref.update({
      feedBacks: responseData,
    });

    return NextResponse.json({ success: true, message: "Replay successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
