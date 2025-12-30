// api/products
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { admin } from "@/lib/firebaseAdmin";
import { cloudinaryUpload } from "../../api/cloudUploads/cloudUpload";
import { randomUUID } from 'crypto';


export async function GET() {
  try {
    const productsData = await admin.firestore().collection("products").get();
    const data = productsData.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}



export async function POST(request) {
  try {
    const data = await request.json();
    if (!data) {
      return NextResponse.json({
        success: false,
        message: "Data is required",
      });
    }

    // ---- Upload main product images ----
    const uploadedImages = await Promise.all(
      (data.images || []).map((image,index) =>
        cloudinaryUpload(image, "Products", `${data.name}_${index}_${randomUUID()}`)
      )
    );

    // ---- Upload brand banner ----
    if (data.brand?.Banner) {
      const bannerUrl = await cloudinaryUpload(
        data.brand.Banner,
        "Banners",
        `${data.brand.brandName}_${randomUUID()}` || `${data.name}_${randomUUID()}`
      );
      data.brand.Banner = bannerUrl;
    }

    // ---- Upload feature images ----
    if (Array.isArray(data.features)) {
      const uploadedFeatures = await Promise.all(
        data.features.map(async (feature,index) => {
          if (!Array.isArray(feature.images)) return feature;

          const uploadedFeatureImages = await Promise.all(
            feature.images.map((img,index2) =>
              cloudinaryUpload(img, "Features", `${feature.title}_${index}_${index2}_${randomUUID()}` || `${data.name}_${index}_${index2}_${randomUUID()}`)
            )
          );

          return {
            ...feature,
            images: uploadedFeatureImages,
          };
        })
      );
      data.features = uploadedFeatures;
    }

    // ---- Replace product images ----
    data.images = uploadedImages;

    // ---- Reference brand in Firestore ----
    const brandSnap = await admin.firestore().doc(`Brands/${data.brand.brandName}`);
    const brandRef = await brandSnap.get();

    if (!brandSnap.exists) {
      return NextResponse.json({
        success: false,
        message: "Brand not found",
      });
    }

    data.brand = brandRef.ref;
    // ---- Save to Firestore ----
    await admin.firestore().collection("products").add(data);

    return NextResponse.json({
      success: true,
      message: "Product added successfully",
      data,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Server Error",
    });
  }
}

