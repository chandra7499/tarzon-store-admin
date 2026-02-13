// api/orders/route.js
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/firebaseAdmin";
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(request) {
  try {
    const admin = getAdmin();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // pending | delivered | cancel

    const snap = await admin.firestore().collection("user").get();
    const orderStatus = (await axios.get(`${baseUrl}/api/orders/status`)).data.data;

    // 1. Build user info with order filter
    const userInfo = snap.docs
      .map((doc) => {
        const u = doc.data();
        const orders = (u.pendingOrder || [])
          .filter(Boolean)
          .filter((o) => (type ? o?.status === String(type) : true));

        const matchedStatus = orderStatus?.find((i) => i.id === doc.id);

        return {
          id: doc.id,
          name: u.Name || "",
          phone: u.Phone || "",
          email: u.email || "",
          avatar: u.profile || "",
          orderStatus: matchedStatus?.status || [],
          orders,
        };
      })
      .filter((u) => u.orders.length > 0);

    // 2. Attach product images inside each order
    const extendedUserInfo = await Promise.all(
      userInfo.map(async (user) => {
        const ordersWithProducts = await Promise.all(
          user.orders.map(async (order) => {
            const placeOrderWithImages = await Promise.all(
              order.placeOrderList.map(async (item) => {
                const productDoc = await admin
                  .firestore()
                  .collection("products")
                  .doc(item.id)
                  .get();

                const productData = productDoc.data() || {};
                return {
                  ...item,
                  images: productData.images || productData.image || [], // add image
                };
              })
            );

            return {
              ...order,
              placeOrderList: placeOrderWithImages,
            };
          })
        );

        return {
          ...user,
          orders: ordersWithProducts,
        };
      })
    );

    return NextResponse.json({ success: true, extendedUserInfo });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
