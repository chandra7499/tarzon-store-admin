"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function BrandScroll() {
  const [brands, setBrands] = useState([])

  useEffect(() => {
    fetch("/api/brands")
      .then(res => res.json())
      .then(setBrands);
  }, [])

  return (
    <main className="flex-1 p-3 border rounded-xl items-center justify-center">
        <h1 className="text-2xl font-semibold">Patner Brands</h1>
    <div className="flex gap-6 w-full overflow-x-auto py-6 scrollbar-hide">
      {brands.map(brand => (
        <div
          key={brand.id}
          className="w-full flex flex-col items-center"
        >
          <Image
            src={brand.logo}
            width={120}
            height={120}
            alt=""
            className="object-cover min-h-29 max-h-30 object-center border-gray-400 border  rounded-full"
          />

          <span className="mt-2 capitalize">{brand.id}</span>
        </div>
      ))}
    </div>
    </main>
  );
}