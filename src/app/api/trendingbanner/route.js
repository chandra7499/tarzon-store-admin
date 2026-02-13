// api/trendingbanner/route.js
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/firebaseAdmin";
import cloudinary from "@/clouds/cloudinaryConfig";
import { randomBytes } from "crypto";
import admin from "firebase-admin";

export async function GET() {
  try {
    const admin = getAdmin();
    const docRef = await admin.firestore().collection("TrendingBanners").get();
    const data = docRef.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}

//post request
export async function POST(request) {
  try {
    const adminApp = getAdmin();
    const db = adminApp.firestore();

    const data = await request.json();
    const itemsArray = Array.isArray(data) ? data : [data];

    // Upload images + build objects
    const uploadItems = await Promise.all(
      itemsArray.map(async (item) => {
        const res = await cloudinary.uploader.upload(item.image, {
          folder: "TrendingBanners",
          public_id: `TrendingBanners/${item.link}`,
          overwrite: true,
          resource_type: "image",
        });

        return {
          id: randomBytes(8).toString("hex"),
          image: res.secure_url,
          link: item.link || "/",
          updatedAt: new Date().toISOString(),
        };
      })
    );

    // 🔐 SINGLE FIXED DOCUMENT
    const docRef = db.collection("TrendingBanners").doc("main");

    await docRef.set(
      {
        items: admin.firestore.FieldValue.arrayUnion(...uploadItems),
      },
      { merge: true }
    );

    return NextResponse.json({
      success: true,
      message: "Banners added successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
// for trending banners particular banner updation

// Delete the trending banner

// export async function DELETE(request, { params }) {
//   try {
//     const admin = getAdmin();
//     const { id } = await params;
//     await admin.firestore().collection("TrendingBanners").doc(id).delete();
//     return NextResponse.json({
//       success: true,
//       message: "Banner deleted successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json({ success: false, error });
//   }
// }
