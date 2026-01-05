// api/products/edit/[id]
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/firebaseAdmin";
import { cloudinaryUpload } from "../../../cloudUploads/cloudUpload";
const admin = getAdmin();
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const docRef = await admin.firestore().collection("products").doc(id).get();
    const data = docRef.data();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await  params;
    const data = await request.json();

    if (!data) {
      return NextResponse.json({
        success: false,
        message: "Data is required",
      });
    }

    // ✅ Upload main images
    const UploadImages = await Promise.all(
      (data.images || []).map(async (image, index) => {
        if (
          typeof image === "string" &&
          image.startsWith("https://res.cloudinary.com")
        ) {
          return image;
        }
        return await cloudinaryUpload(
          image,
          "Products",
          `${data.name}_${index}_${id}`
        );
      })
    );

    // ✅ Upload feature images
    const updatedFeatures = await Promise.all(
      (data.features || []).map(async (feature, featureIndex) => {
        const featureImages = await Promise.all(
          (feature.images || []).map(async (img, i) => {
            if (
              typeof img === "string" &&
              img.startsWith("https://res.cloudinary.com")
            ) {
              return img;
            }
            return await cloudinaryUpload(
              img,
              "Features",
              `${data.name}_feature_${featureIndex}_${i}_${id}`
            );
          })
        );
        return { ...feature, images: featureImages };
      })
    );

    // ✅ Handle brand banner safely
    let bannerUrl;
    if (
      data.brand?.Banner &&
      data.brand.Banner.startsWith("https://res.cloudinary.com/")
    ) {
      bannerUrl = data.brand.Banner;
    } else if (data.brand?.Banner) {
      bannerUrl = await cloudinaryUpload(
        data.brand.Banner,
        "Banners",
        `${data.name}_banner_${id}`
      );
    } else {
      bannerUrl = ""; // fallback
    }

    const brandSnap = admin.firestore().doc(`Brands/${(data.brand.brandName).toLowerCase()}`);
    const brandRef = await brandSnap.get();
    // ✅ Clean and prepare final data
    const updatedData = {
      ...data,
      images: UploadImages,
      features: updatedFeatures,
      brand: {
        ...data.brand,
        Banner: bannerUrl,
        logo:brandRef.ref
      },
    };

    // ✅ Update Firestore
    await admin.firestore().collection("products").doc(id).update(updatedData);

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("❌ Update error:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
