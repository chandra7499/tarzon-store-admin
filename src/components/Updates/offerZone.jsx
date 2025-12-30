"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { handleOffers } from "../../functions/handleOffer";
import { dateOut } from "@/functions/secondsToDate";
import { PostHandleOfferZone } from "../../functions/handleOffer";
import { Spinner } from "../ui/spinner";

export default function OfferZoneForm({ initialData = {} }) {
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [DatabaseData, setdataBase] = useState([]);
  const [matchingData, setMatchingData] = useState(false);
  const [offer, setOffer] = useState({
    offername: initialData.offername || "",
    deliveryCharges: initialData.deliveryCharges || 0,
    gst: initialData.gst || 0,
    storeDiscount: initialData.storeDiscount || 0,
    promoCode: Array.isArray(initialData.promoCode)
      ? [initialData.promoCode] // convert your single promo array into nested form
      : [],
  });

  useEffect(() => {
    async function handleOffer() {
      try {
        setDataLoading(true);
        const offerData = await handleOffers();
        setdataBase(offerData);
        setOffer(...offerData);
      } catch (error) {
        console.log(error);
      } finally {
        setDataLoading(false);
      }
    }
    handleOffer();
  }, []);

  useEffect(() => {
    if (!offer) {
      return;
    }
    const offerData = DatabaseData?.find(
      (item) =>
        item.offername === offer.offername &&
        item.deliveryCharges === Number(offer.deliveryCharges) &&
        item.gst === Number(offer.gst) &&
        item.storeDiscount === Number(offer.storeDiscount) &&
        item.promoCode[0] === offer.promoCode[0] &&
        item.promoCode[1] === Number(offer.promoCode[1]) &&
        item.promoCode[2] === offer.promoCode[2]
    );

    setMatchingData(offerData ? true : false);
  }, [offer]);

  const handleChange = (field, value) => {
    setOffer({ ...offer, [field]: value });
  };

  const handlePromoChange = (index, value) => {
    const updated = [...offer.promoCode];

    if (index === 0) updated[index] = value;
    if (index === 1) updated[index] = Number(value);
    if (index === 2) updated[index] = value;

    setOffer({ ...offer, promoCode: updated });
  };

  console.log(offer);

  const handleSave = async () => {
    // Convert back to Firestore structure:
    try {
      const dataToSave = {
        offername: offer.offername,
        deliveryCharges: Number(offer.deliveryCharges),
        gst: Number(offer.gst),
        storeDiscount: Number(offer.storeDiscount),
        promoCode: offer.promoCode || [], // single promo as array
      };
      console.log("Saving Offer:", dataToSave);
      setIsLoading(true);
      await PostHandleOfferZone(dataToSave);
      console.log("successful");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <motion.div
      className="w-full mx-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            🛍️ Offer Zone Settings {dataLoading && <span className="text-xl ml-3 text-gray-500">Fetching...</span>}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Offer Name"
              value={offer?.offername}
              onChange={(e) => handleChange("offername", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Delivery Charges"
              value={offer?.deliveryCharges === 0 ? "" : offer.deliveryCharges}
              onChange={(e) =>
                handleChange("deliveryCharges", Number(e.target.value))
              }
            />
            <Input
              type="number"
              placeholder="GST (%)"
              value={offer?.gst === 0 ? "" : offer.gst}
              onChange={(e) => handleChange("gst", Number(e.target.value))}
            />
            <Input
              type="number"
              placeholder="Store Discount (%)"
              defaultValue={
                offer?.storeDiscount === 0 ? "" : offer?.storeDiscount
              }
              onChange={(e) =>
                handleChange("storeDiscount", Number(e.target.value))
              }
            />
          </div>

          <div className="border rounded-lg p-4 space-y-3">
            <h4 className="font-medium">🎟️ PromoCodes</h4>
            <div className="grid grid-cols-3 gap-2 items-center border p-3 rounded-lg">
              {offer?.promoCode?.map((promo, i) => (
                <Input
                  key={i}
                  type={i === 0 ? "text" : i === 1 ? "number" : "date"}
                  placeholder="Promo Code"
                  defaultValue={i === 2 ? dateOut(promo) : promo}
                  onChange={(e) => handlePromoChange(i, e.target.value)}
                />
              ))}
            </div>
          </div>

          <Button
            disabled={isLoading || matchingData || dataLoading}
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 w-full flex text-white"
          >
            <Spinner show={isLoading} />
            update
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
