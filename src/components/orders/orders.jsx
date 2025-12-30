"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OrderList from "@/components/ui/Order/OrderList";

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  return (
    <section className="flex flex-col p-3  gap-6 w-full h-full ">
      <h1 className="text-2xl font-semibold">Manage Orders</h1>

      {/* Search Bar */}
      <div className="flex justify-between items-center w-full max-w-3xl">
        <Input
          placeholder="Search orders by name, email, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-lg"
        />
      </div>

      {/* Tabs for Categories */}
      <Tabs
        defaultValue="pending"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full "
      >
        <TabsList className="bg-white p-1 rounded-lg shadow-md">
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-md px-4 py-2"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="delivered"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-md px-4 py-2"
          >
            Delivered
          </TabsTrigger>
          <TabsTrigger
            value="cancel"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-md px-4 py-2"
          >
            cancel
          </TabsTrigger>
          <TabsTrigger
            value="returned"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-md px-4 py-2"
          >
            Returned
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <OrderList searchTerm={searchTerm} status="pending" />
        </TabsContent>

        <TabsContent value="delivered">
          <OrderList searchTerm={searchTerm} status="delivered" />
        </TabsContent>

        <TabsContent value="cancel">
          <OrderList searchTerm={searchTerm} status="cancel" />
        </TabsContent>
        <TabsContent value="returned">
          <OrderList searchTerm={searchTerm} status="returned" />
        </TabsContent>
      </Tabs>
    </section>
  );
}
