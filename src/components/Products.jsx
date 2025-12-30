"use client";
import Card from "./Card";
import { useState, useEffect } from "react";
import { handleProducts } from "@/functions/handleProducts";
const Products = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const res = await handleProducts();
        setData(res);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    getData();
  }, []);

  if (isLoading) {
    return <div className="flex w-full h-[100vh] text-3xl justify-center items-center">Loading...</div>;
  }

  return (
    <>
      <section className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] justify-items-center gap-5 ">
        {data?.map((item, index) => {
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
