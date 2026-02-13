// app/api/admin/revenue/route.js
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const snapshot = await getAdmin()
      .firestore()
      .collection("user")
      .get();

    let onlineRevenue = 0; // paise
    let codRevenue = 0;    // rupees

    snapshot.forEach((doc) => {
      const userData = doc.data();

      const payments = userData.paymentsStatus;

      if (!payments) return;

      // 🔹 If paymentStatus is an ARRAY
      if (Array.isArray(payments)) {
        payments.forEach((payment) => {
          if (payment.status === "paid" && typeof payment.amount_paid === "number") {
            onlineRevenue += payment.amount_paid;
          }

          if (payment.status === "COD" && typeof payment.amount === "number") {
            codRevenue += payment.amount;
          }
        });
      }

      // 🔹 If paymentStatus is a MAP / OBJECT
      if (typeof payments === "object" && !Array.isArray(payments)) {
        Object.values(payments).forEach((payment) => {
          if (payment.status === "paid" && typeof payment.amount_paid === "number") {
            onlineRevenue += payment.amount_paid;
          }

          if (payment.status === "COD" && typeof payment.amount === "number") {
            codRevenue += payment.amount;
          }
        });
      }
    });

    return NextResponse.json({
      success: true,
      revenue: {
        online: onlineRevenue / 100, // paise → rupees
        cod: codRevenue,
        total: onlineRevenue / 100 + codRevenue,
      },
    });
  } catch (err) {
    console.error("Revenue calc failed:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
