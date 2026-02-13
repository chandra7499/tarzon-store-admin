"use client";

import Card from "./Card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleProducts } from "@/functions/handleProducts";

const Products = () => {
  const dispatch = useDispatch();

  // ✅ read products from Redux
  const products = useSelector((state) => state.products.products);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        // ✅ If already in Redux, don’t refetch
        if (products.length > 0) return;

        setIsLoading(true);
        await handleProducts(dispatch);
      } catch (error) {
        console.error("Load products failed:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [dispatch, products.length]);

  if (isLoading) {
    return (
      <div className="flex w-full h-screen text-3xl justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <section className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] justify-items-center gap-5">
      {products.map((item) => {
        const image =
          Array.isArray(item.images) && item.images.length > 0
            ? item.images[0]
            : item.image;

        return (
          <Card
            key={item.id}
            id={item.id}
            Title={item.name || item.title}
            image={image}
            details={item.price}
          />
        );
      })}
    </section>
  );
};

export default Products;
