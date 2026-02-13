import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const admin = getAdmin();
    if (!admin) {
      throw new Error("Firebase Admin not initialized");
    }
    const snapshot = await admin.firestore().collection("offerZone").get();

    if (snapshot.empty) {
      return NextResponse.json(
        {
          success: true,
          offerDocs: [],
        },
        { status: 200 }
      );
    }

    const offerDocs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, offerDocs }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const admin = getAdmin();
    const updatedData = await request.json();

    if (!updatedData || Object.keys(updatedData).length === 0) {
      return NextResponse.json(
        { success: false, message: "No data found" },
        { status: 400 }
      );
    }

    const snapshot = await admin.firestore().collection("offerZone").get();

    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, message: "No offerZone document found" },
        { status: 404 }
      );
    }

    await admin
      .firestore()
      .collection("offerZone")
      .doc(snapshot.docs[0].id)
      .update(updatedData);

    return NextResponse.json(
      { success: true, message: "Data updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
