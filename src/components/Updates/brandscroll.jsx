"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function BrandScroll() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBrands() {
      try {
        const res = await fetch("/api/brands");
        const data = await res.json();
        setBrands(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadBrands();
  }, []);

  return (
    <section className="relative border border-white/60 w-full overflow-hidden bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">🤝 Partner Brands</h2>
        <p className="text-sm text-gray-400">
          Trusted by leading companies worldwide
        </p>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex gap-4 overflow-x-auto">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-28 h-28 rounded-full bg-white/20 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Brands */}
      {!loading && (
        <div className="relative overflow-x-auto  max-w-[78rem]">
          <div className="flex max-w gap-6 verflow-x-auto scroll-smooth snap-x snap-mandatory py-4 scrollbar-hide">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="snap-start flex-shrink-0 w-[140px] flex flex-col items-center gap-3 group"
              >
                {/* Logo */}
                <div className="w-28 h-28 rounded-full bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={brand.logo}
                    alt={brand.name || "brand"}
                    width={120}
                    height={120}
                    className="object-cover object-center p-3"
                  />
                </div>

                {/* Name */}
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition">
                  {brand.name || brand.id}
                </span>
              </div>
            ))}
          </div>

          {/* Edge fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/40 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/40 to-transparent" />
        </div>
      )}
    </section>
  );
}