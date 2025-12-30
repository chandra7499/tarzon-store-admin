export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { admin } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const docRef = await admin.firestore().collection("policies").get();
    if (!docRef) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    const data = docRef.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

//for post a new Post
export async function POST(request) {
  try {
    const data = await request.json();
    console.log(data);
    if (!data.id || !data.name || !data.content) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    const docRef = admin.firestore().collection("policies").doc(data.id);
    const newDoc = {
      name: data.name,
      content: data.content,
      lastedUpdated: data.lastedUpdated,
    };
    await docRef.set(newDoc);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const docRef = admin
      .firestore()
      .collection("policies")
      .doc(data.id)

    if (!data.id || !data.name || !data.content || !data.lastedUpdated) {
      return NextResponse.json({ success: false,message:"Missing Data"}, { status: 404 });
    }
    const UpdatedObj = {
      name: data.name,
      content: data.content,
      lastedUpdated: data.lastedUpdated,
    };
    await admin
      .firestore()
      .collection("policies")
      .doc(data.id)
      .update(UpdatedObj);
    return NextResponse.json({ success: true, message: "Updated Successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
