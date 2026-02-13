import { NextResponse } from "next/server";
import cloudinary from "@/clouds/cloudinaryConfig";
import { getAdmin } from "@/lib/firebaseAdmin";


export async function GET() {
  const adminApp = getAdmin();
  const db = adminApp.firestore();

  const snap = await db.collection("Brands").get();

  const brands = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json(brands);
}

export async function POST(req) {
  try {
    const { name, logo, banners } = await req.json();

    if (!name || !logo) {
      return NextResponse.json({ success: false });
    }

    const adminApp = getAdmin();
    const db = adminApp.firestore();

    // Upload logo
    const logoRes = await cloudinary.uploader.upload(logo, {
      folder: "Brands/logos",
      public_id: name + "_logo",
      overwrite: true,
    });

    // Upload banners
    const bannerUrls = await Promise.all(
      banners.map(async (img, i) => {
        const res = await cloudinary.uploader.upload(img, {
          folder: "Brands/banners",
          public_id: `${name}_${i}`,
          overwrite: true,
        });
        return res.secure_url;
      })
    );

    // Save to Firestore
    await db.collection("Brands").doc(name.toLowerCase()).set({
      logo: logoRes.secure_url,
      banners: bannerUrls,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}