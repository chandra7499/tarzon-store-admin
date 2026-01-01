"use client";
import Card from "./Card";
import { useState, useEffect } from "react";
import { handleProducts } from "@/functions/handleProducts";
const Products = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const result = await handleProducts();

      if (result.error) {
        setProducts([]);
        return;
      }

      setProducts(result.data);
    }

    loadProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex w-full h-screen text-3xl justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <section className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] justify-items-center gap-5 ">
        {products?.map((item, index) => {
          const image = Array.isArray(item.image) ? item.image : [item.image];
          return (
            <Card
              key={index}
              id={item.id}
              Title={item.title}
              image={image[0] || item.images[0]}
              details={item.price}
            />
          );
        })}
      </section>
    </>
  );
};

export default Products;
