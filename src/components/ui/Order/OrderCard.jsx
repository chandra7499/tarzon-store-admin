"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { handleOrderStatusUpdate } from "@/functions/handleOrders";
import { Spinner } from "../spinner";

export default function OrderCard({ order, setUpdatedStatus, isLoading }) {
  const [statusList, setStatusList] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentOrderID, setCurrentOrderID] = useState(null);

  useEffect(() => {
    setStatusList(order?.orderStatus || []); // store all status entries
  }, [order]);

  const statusSteps = [
    "Order Placed",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  // Calculate grand total
  const totalPrice =
    order?.orders
      ?.flatMap((o) => o.placeOrderList || [])
      .reduce(
        (sum, item) =>
          sum + (item.price || 0) * Number(item.quantity || item.qty || 1),
        0
      ) || 0;

  //order update functions
  async function orderStatusUpdate(value, orderId) {
    try {
      setCurrentOrderID(orderId);
      setIsUpdating(true);
      const currentIndex = statusSteps.findIndex((step) => step === value);
      await handleOrderStatusUpdate(orderId, currentIndex, order.id, value);
      setUpdatedStatus((prev) => !prev);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
      setCurrentOrderID(null);
    }
  }

  return (
    <Card className="bg-white/70 backdrop-blur-xl shadow-lg border rounded-2xl max-h-[500px]">
      {/* Header */}
      <CardHeader className="flex items-center justify-between flex-col gap-5">
        <div className="flex  items-center gap-3 w-full">
          <Image
            src={
              order?.avatar ||
              "https://png.pngtree.com/png-clipart/20200224/original/pngtree-cartoon-color-simple-male-avatar-png-image_5230557.jpg"
            }
            alt={order?.name}
            width={40}
            height={40}
            className="rounded-full w-15 h-15 object-cover"
          />
          <div>
            <p className="font-semibold text-gray-800">{order?.name}</p>
            <p className="text-sm text-gray-600">{order?.email}</p>
            <p className="text-xs text-gray-700">{order?.phone}</p>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-5 max-h-[350px] overflow-y-scroll">
        {order?.orders?.map((o, i) => {
          // find matching status entry by orderId
          const matchedStatus = statusList.find((s) => s.orderId === o.orderId);

          const currentStep =
            matchedStatus?.deliveryPoints?.currentStep ?? null;

          return (
            <div
              key={i}
              className="border border-gray-200 p-4 rounded-xl bg-white/40 space-y-4"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-700">
                  Order ID: {o.orderId}
                </p>
                <p
                  className={`text-sm font-medium ${
                    o.status === "pending"
                      ? "text-yellow-600"
                      : o.status === "Delivered"
                      ? "text-green-600"
                      : o.status === "cancel"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {o.status}
                </p>
              </div>

              {/* Product list */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {o.placeOrderList?.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-col items-center text-center border rounded-lg p-2 bg-white/60 min-w-[100px]"
                  >
                    <Image
                      src={p?.images ? p?.images[0] : p.image || "/file.svg"}
                      alt={p?.id}
                      width={100}
                      height={100}
                      className="rounded-lg grow flex "
                    />
                    <p className="text-xs mt-1 text-black">{p?.name}</p>
                    <p className="text-xs text-gray-600">
                      Qty: {p.quantity || p.qty}
                    </p>
                    <p className="text-xs text-gray-800 font-semibold">
                      ₹{p.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Total & Status Select */}
              <div className="flex justify-between items-center mt-3">
                <p className="text-lg font-semibold text-gray-700">
                  ₹
                  {o.placeOrderList
                    ?.reduce(
                      (acc, item) =>
                        acc +
                        (item.price || 0) *
                          Number(item.quantity || item.qty || 1),
                      0
                    )
                    .toLocaleString("en-IN")}
                </p>

                {/* Show Select only if pending */}
                {o.status === "pending" && matchedStatus ? (
                  <Select
                    disabled={currentOrderID === o.orderId && isUpdating}
                    value={statusSteps[currentStep]}
                    onValueChange={(e) => orderStatusUpdate(e, o.orderId)}
                  >
                    <SelectTrigger className="max-w-40 bg-black text-white">
                      <SelectValue placeholder={statusSteps[currentStep]} />
                    </SelectTrigger>

                    <SelectContent className="bg-black text-white">
                      {statusSteps.map((step) => (
                        <SelectItem key={step} value={step}>
                          {currentOrderID === o.orderId && (
                            <Spinner show={isLoading || isUpdating} />
                          )}
                          {step}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-lg font-semibold text-gray-600">
                    {o.status}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>

      {/* Grand Total */}
      <div className="flex justify-end px-5 py-2">
        <p className="text-lg font-semibold text-gray-800">
          Total: ₹{totalPrice.toLocaleString("en-IN")}
        </p>
      </div>
    </Card>
  );
}
