// api/trendingbanner/route.js
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/firebaseAdmin";
import cloudinary from "@/clouds/cloudinaryConfig";
import {randomBytes} from "crypto"

const admin = getAdmin();
export async function GET() {
  try {
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
    const data = await request.json();
    console.log(data);
    Array.isArray(data) ? data : [data];
    const uuid = randomBytes(8).toString("hex");
    const uploadItems = await Promise.all(
      data.map(async (item) => {
        const res_url = await cloudinary.uploader.upload(item.image, {
          folder: "TrendingBanners",
          public_id: `TrendingBanners/${item.link}`,
          access_mode: "public",
          resource_type: "image",
          overwrite: true,
        });
        return {
          id: uuid,
          image: res_url.secure_url,
          link: item.link || "/",
        };
      })
    );

    const DocId = await admin.firestore().collection("TrendingBanners").get();

    if (DocId.empty) {
      await admin
        .firestore()
        .collection("TrendingBanners")
        .add({ items: JSON.parse(JSON.stringify(uploadItems)) });
    }
    //update the field
    else {
      await admin
        .firestore()
        .collection("TrendingBanners")
        .doc(DocId.docs[0].id)
        .update({ items: admin.firestore.FieldValue.arrayUnion(...uploadItems) });
    }

    return NextResponse.json({
      success: true,
      message: "Banners added successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({success: false,error});
  }
}