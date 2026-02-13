import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/firebaseAdmin";
import cloudinary from "@/clouds/cloudinaryConfig";

export async function DELETE(request, { params }) {
  try {
    const admin = getAdmin();
    const { id } = await params;
    const { publicId } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing banner ID" },
        { status: 400 },
      );
    }

    // 🔎 Get main doc
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

    let items = data.items || [];

    const index = items.findIndex((i) => String(i.id) === String(id));

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404 },
      );
    }

    /* =====================
       DELETE CLOUDINARY
    ===================== */

    if (publicId) {
      console.log("Destroying Cloudinary:", publicId);

      const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });


      console.log("Cloudinary result:", result);
    }

    /* =====================
       REMOVE FROM ARRAY
    ===================== */

    items.splice(index, 1);

    await docRef.update({
      items,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}
