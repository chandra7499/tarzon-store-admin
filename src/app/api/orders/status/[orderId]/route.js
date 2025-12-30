export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { admin } from "@/lib/firebaseAdmin";
export async function PUT(request, { params }) {
  try {
    const { orderId } = await params;
    const { status, userId, value } = await request.json();
    const docRef = await admin.firestore().collection("user").doc(userId).get();

    if (!docRef.exists) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    const userData = docRef.data();

    if (!userData) {
      return NextResponse.json({
        success: false,
        message: "User data not found",
      });
    }

    //i need to update orderStatus match to orderId then update delivery Point
    const newOrderStatus = userData.orderStatus.map((order) => {
      if (order.orderId === orderId) {
        return {
          ...order,
          deliveryPoints: {
            ...order.deliveryPoints,
            currentStep: status,
          },
        };
      }
      return order;
    });

    if (value === "Delivered") {
      const pendingOrdersUpdate = userData.pendingOrder.map((pOrder) => {
        if (pOrder.orderId === orderId) {
          return {
            ...pOrder,
            status: "delivered",
            deliverdAt: new Date().toISOString(),
          };
        }
        return pOrder;
      });
      await admin
        .firestore()
        .collection("user")
        .doc(userId)
        .update({ pendingOrder: pendingOrdersUpdate });
    }

    await admin
      .firestore()
      .collection("user")
      .doc(userId)
      .update({ orderStatus: newOrderStatus });

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
