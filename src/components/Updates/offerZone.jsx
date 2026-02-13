"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Spinner } from "../ui/spinner";

import { handleOffers, PostHandleOfferZone } from "@/functions/handleOffer";
import { dateOut } from "@/functions/secondsToDate";

const EMPTY_OFFER = {
  offername: "",
  deliveryCharges: 0,
  gst: 0,
  storeDiscount: 0,
  promoCode: ["", 0, ""],
};

export default function OfferZoneForm() {
  const dispatch = useDispatch();

  /* =========================
     GLOBAL STATE
  ========================= */
  const offers = useSelector((state) => state.offers.offers);

  /* =========================
     LOCAL STATE
  ========================= */
  const [offer, setOffer] = useState(EMPTY_OFFER);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [matchingData, setMatchingData] = useState(false);

  /* =========================
     FETCH OFFERS
  ========================= */
  useEffect(() => {
    if (offers.length > 0) return;

    async function loadOffers() {
      try {
        setDataLoading(true);
        await handleOffers(dispatch);
      } catch (err) {
        console.error("Offer fetch failed:", err);
      } finally {
        setDataLoading(false);
      }
    }

    loadOffers();
  }, [dispatch, offers.length]);

  /* =========================
     INITIALIZE FORM FROM REDUX
  ========================= */
  useEffect(() => {
    if (!offers.length) return;

    const current = offers[0]; // ✅ FIRST OFFER

    setOffer({
      offername: current.offername || "",
      deliveryCharges: current.deliveryCharges ?? 0,
      gst: current.gst ?? 0,
      storeDiscount: current.storeDiscount ?? 0,
      promoCode: Array.isArray(current.promoCode)
        ? [...current.promoCode]
        : ["", 0, ""],
    });
  }, [offers]);

  /* =========================
     MATCH CHECK
  ========================= */
  useEffect(() => {
    if (!offers.length) return;

    const match = offers.find(
      (item) =>
        item.offername === offer.offername &&
        Number(item.deliveryCharges) === Number(offer.deliveryCharges) &&
        Number(item.gst) === Number(offer.gst) &&
        Number(item.storeDiscount) === Number(offer.storeDiscount) &&
        item.promoCode?.[0] === offer.promoCode?.[0] &&
        Number(item.promoCode?.[1]) === Number(offer.promoCode?.[1]) &&
        item.promoCode?.[2] === offer.promoCode?.[2]
    );

    setMatchingData(Boolean(match));
  }, [offer, offers]);

  /* =========================
     HANDLERS
  ========================= */
  const handleChange = (field, value) => {
    setOffer((prev) => ({ ...prev, [field]: value }));
  };

  const handlePromoChange = (index, value) => {
    setOffer((prev) => {
      const updated = [...prev.promoCode];
      updated[index] = index === 1 ? Number(value) : value;
      return { ...prev, promoCode: updated };
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      await PostHandleOfferZone({
        ...offer,
        deliveryCharges: Number(offer.deliveryCharges),
        gst: Number(offer.gst),
        storeDiscount: Number(offer.storeDiscount),
      });

      await handleOffers(dispatch);
    } catch (err) {
      console.error("Save offer failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <motion.div className="w-full mx-auto p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card>
        <CardHeader>
          <CardTitle>
            🛍️ Offer Zone Settings
            {dataLoading && <span className="ml-3 text-sm text-gray-500">Fetching...</span>}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input value={offer.offername} onChange={(e) => handleChange("offername", e.target.value)} />
            <Input type="number" value={offer.deliveryCharges || ""} onChange={(e) => handleChange("deliveryCharges", e.target.value)} />
            <Input type="number" value={offer.gst || ""} onChange={(e) => handleChange("gst", e.target.value)} />
            <Input type="number" value={offer.storeDiscount || ""} onChange={(e) => handleChange("storeDiscount", e.target.value)} />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {offer.promoCode.map((p, i) => (
              <Input
                key={i}
                type={i === 1 ? "number" : i === 2 ? "date" : "text"}
                className={`${i===2 && "bg-gray-500"}`}
                value={i === 2 ? dateOut(p) : p}
                onChange={(e) => handlePromoChange(i, e.target.value)}
              />
            ))}
          </div>

          <Button variant={"outline"} disabled={isSaving || matchingData || dataLoading} onClick={handleSave}>
            <Spinner show={isSaving} /> Update Offer
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
