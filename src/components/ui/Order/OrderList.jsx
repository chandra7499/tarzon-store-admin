"use client";
import { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import { handleOrders } from "@/functions/handleOrders";

export default function OrderList({ searchTerm, status }) {
  const [mockOrders, setMockOrders] = useState([]);
  const [updatedStatus, setUpdatedStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const orders = await handleOrders(status);
        setMockOrders(orders);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [status, updatedStatus]);

  const filteredOrders = mockOrders?.filter(
    (order) =>
      order?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      order?.email?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      order?.id?.toLowerCase().includes(searchTerm?.toLowerCase())
  ); // latest first

  console.log(filteredOrders);
  console.log(mockOrders);

  return (
    <div className="grid gap-4 mt-4">
      {filteredOrders?.length > 0 ? (
        filteredOrders?.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            setUpdatedStatus={setUpdatedStatus}
            isLoading={isLoading}
          />
        ))
      ) : (
        <p className="text-gray-500 text-center py-10">
          {isLoading ? "Fetching..." : "No orders found"}
        </p>
      )}
    </div>
  );
}
