"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

import { handleOffers } from "@/functions/handleOffer";

const OfferZone = () => {
  const dispatch = useDispatch();

  // ✅ GLOBAL STATE
  const offers = useSelector((state) => state.offers.offers);

  const [isLoading, setLoading] = useState(false);
  const [offerDropSlide, setOfferDropSlide] = useState(false);

  // ✅ Same useEffect pattern as Products & Trending
  useEffect(() => {
    async function loadOffers() {
      try {
        if (offers.length > 0) return; // ✅ Redux cache

        setLoading(true);
        await handleOffers(dispatch);
      } catch (err) {
        console.error("Offer fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }

    loadOffers();
  }, [dispatch, offers.length]);

  const activeOffer =
    offers.length > 0 &&
    new Date(offers[0]?.promoCode?.[2]) >= new Date();

  function handleDropSlide() {
    setOfferDropSlide((prev) => !prev);
  }

  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-2 flex w-full justify-between">
          🎉 Offer Zone
          {isLoading && (
            <span className="text-sm text-gray-400 ml-3">Fetching...</span>
          )}
        </h2>

        <ul className="space-y-2">
          {offers.map((offer) => (
            <li
              key={offer.id}
              className={clsx(
                "p-3 rounded-md border",
                activeOffer
                  ? "bg-green-100 border-green-400"
                  : "bg-gray-100 border-gray-300"
              )}
            >
              <div className="flex justify-between text-slate-800">
                <span>{offer.offername}</span>

                <span
                  className={clsx(
                    "text-sm font-medium flex items-center gap-1",
                    activeOffer ? "text-green-600" : "text-gray-500"
                  )}
                >
                  {activeOffer ? "Active" : "Expired"}

                  <ChevronDown
                    onClick={handleDropSlide}
                    className={clsx(
                      "cursor-pointer transition-transform duration-300",
                      offerDropSlide ? "rotate-180" : "rotate-0"
                    )}
                  />
                </span>
              </div>
            </li>
          ))}

          {/* DROPDOWN */}
          <div
            className={clsx(
              "overflow-hidden transition-all duration-300 rounded-lg border flex flex-col items-center",
              offerDropSlide
                ? "max-h-40 border-gray-300/40"
                : "max-h-0 border-transparent"
            )}
          >
            {offers[0]?.promoCode?.map((code, idx) => (
              <p key={idx} className="py-1 text-sm">
                {code}
              </p>
            ))}
          </div>
        </ul>
      </CardContent>
    </Card>
  );
};

export default OfferZone;
