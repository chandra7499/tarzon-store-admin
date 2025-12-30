"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { handleOffers } from "@/functions/handleOffer";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

const OfferZone = () => {
  const [offers, setOffers] = useState([]);
  const [activeOffer, setActive] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [offerDropSlide, setOfferDropSlide] = useState(false);
  useEffect(() => {
    async function fetchOffers() {
      try {
        setLoading(true);
        const data = await handleOffers();
        const status = new Date(data[0]?.promoCode[2]) >= new Date();
        setOffers(data);
        setActive(status);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, []);

  function handleDropSlide() {
    setOfferDropSlide((prev) => !prev);
  }

  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-2 flex w-full justify-between">
          🎉 Offer Zone{" "}
          {isLoading && <p className="text-sm text-gray-400">Fetching...</p>}{" "}
        </h2>
        <ul className="space-y-2">
          {offers?.map((offer) => (
            <li
              key={offer.id}
              className={`p-3 rounded-md border ${
                activeOffer
                  ? "bg-green-100 border-green-400"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <div className="flex justify-between text-slate-800">
                <span>{offer.offername}</span>
                <span
                  className={`text-sm font-medium  flex items-center gap-1 ${
                    activeOffer ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {activeOffer ? "Active" : "Expired"}
                  <ChevronDown
                    className={clsx(`cursor-pointer flex items-center ${offerDropSlide ? "rotate-180 transition-all duration-300 " : "rotate-0 transition-all duration-300"}`)}
                    onClick={handleDropSlide}
                  />
                </span>
              </div>
            </li>
          ))}
          {
            <span
              className={clsx(
                `overflow-hidden transition-all border-2 duration-300 rounded-lg flex flex-col  items-center ease-in-out ${
                  offerDropSlide ? "max-h-40  border-gray-300/40" : "max-h-0 border-gray-400/0" 
                }`
              )}
            >
              {offers[0]?.promoCode?.map((codeDetails)=>{
                return <p key={codeDetails}> {codeDetails}</p>
              })}
            </span>
          }
        </ul>
      </CardContent>
    </Card>
  );
};

export default OfferZone;
