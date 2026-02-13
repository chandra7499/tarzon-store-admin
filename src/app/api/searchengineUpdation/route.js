export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/firebaseAdmin";
import { algoliasearch } from "algoliasearch";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
);

export async function GET() {
  try {
    const admin = getAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Firebase Admin not initialized" },
        { status: 500 },
      );
    }

    const db = admin.firestore();
    const snapshot = await db.collection("products").get();

    if (snapshot.empty) {
      return NextResponse.json({
        success: true,
        message: "No products found in Firestore",
      });
    }

    const products = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        objectID: doc.id,
        name: data.name || "",
        category: data.category || "",
        price: data.price || 0,
        image: Array.isArray(data.images) ? data.images[0] : data.images || [],
        rating: data.rating || 0,
        tags: data.tags || [],
        description: data.description || "",
      };
    });

    // ✅ Algolia v5 way
    await client.saveObjects({
      indexName: "products",
      objects: products,
    });

    return NextResponse.json({
      success: true,
      message: "Products synced to Algolia successfully",
      count: products.length,
    });
  } catch (error) {
    console.error("Algolia sync error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Algolia sync failed",
      },
      { status: 500 },
    );
  }
}
