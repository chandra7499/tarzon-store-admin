import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/firebaseAdmin";
import cloudinary from "@/clouds/cloudinaryConfig";

export async function PUT(request, { params }) {
  try {
    const admin = getAdmin();
    const { id } = await params;
    const { imageData, publicId, link } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    // 🔎 Get parent doc
    const snap = await admin
      .firestore()
      .collection("TrendingBanners")
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json(
        { success: false, message: "Collection empty" },
        { status: 404 },
      );
    }

    const doc = snap.docs[0];
    const docRef = doc.ref;
    const data = doc.data();

    const items = data.items || [];

    // 🔎 Find banner inside array
    const index = items.findIndex((i) => String(i.id) === String(id));

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404 },
      );
    }

    /* ===========================
        IMAGE OVERWRITE
    =========================== */

    if (imageData) {
      // 1️⃣ Remove old cloudinary asset
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }

      // 2️⃣ Upload new image with NEW NAME
      const newPublicId = link.replace(/\s+/g, "-").toLowerCase();

      const upload = await cloudinary.uploader.upload(imageData, {
        folder: "TrendingBanners",
        public_id: newPublicId,
        resource_type: "image",
        access_mode: "public",
      });

      // 3️⃣ Update firebase item
      items[index].image = upload.secure_url;
    }

    /* ===========================
        LINK UPDATE
    =========================== */

    if (typeof link === "string") {
      items[index].link = link;
    }

    /* ===========================
        SAVE BACK TO FIRESTORE
    =========================== */

    await docRef.update({
      items,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Banner updated successfully",
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}
