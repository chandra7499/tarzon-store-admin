"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";

export default function ImagesSection({
  formData,
  dispatch,
  title = "Product Images",
  dynamicId = "add-images",
  Key = "images",
  featureIndex = null,
}) {
  const [productImages, setProductImages] = useState([]);
  const fileInputsRef = useRef([]); // 🧠 keep refs for each image to trigger replace action

  useEffect(() => {
    if (featureIndex !== null) {
      setProductImages(formData?.features?.[featureIndex]?.images || []);
    } else {
      setProductImages(formData?.images || [formData?.image].filter(Boolean));
    }
  }, [formData, featureIndex]);

  // 🧠 Common function to update Redux/form state
  const updateImages = (updater) => {
    const updated = typeof updater === "function" ? updater(productImages) : updater;
    setProductImages(updated);
    if (featureIndex !== null) {
      const newFeatures = [...formData.features];
      newFeatures[featureIndex].images = updated;
      dispatch({
        type: "SET_FIELD",
        key: "features",
        value: newFeatures,
      });
    } else {
      dispatch({
        type: "SET_FIELD",
        key: Key,
        value: updated,
      });
    }
  };

  // 📤 Add new image
  const handleAddImage = async(files) => {
    if (!files) return;

    const fileArr = Array.isArray(files) ? files : Array.from(files);
    try {
      const base64List = await Promise.all(
        fileArr.map(
          (f) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result); // data:...base64
              reader.onerror = reject;
              reader.readAsDataURL(f);
            })
        )
      );

      // productImages is assumed state array of base64 strings
      updateImages((prev) => [...(prev || []), ...base64List]);
    } catch (err) {
      console.error("Error reading files as base64", err);
    }
  };

  // ✏️ Replace an image (edit in place)
  const handleReplaceImage = (index, file) => {
    if(!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      const updated = [...productImages];
      updated[index] = base64; // replace only that slot
      updateImages(updated);
    };
    reader.readAsDataURL(file);
  };

  // ❌ Remove an image
  const handleRemoveImage = (index) => {
    const updated = productImages.filter((_, i) => i !== index);
    updateImages(updated);
  };

  return (
    <div className="border border-white/20 p-4 rounded-lg space-y-4 w-full">
      <h3 className="font-semibold text-lg">{title}</h3>

      <div className="grid grid-cols-5 w-full justify-items-center gap-5">
        {productImages?.map((img, i) => (
          <div key={i} className="relative group">
            <Image
              src={img || "/globe.svg"}
              alt={`Image ${i + 1}`}
              width={600}
              height={600}
              className="rounded-xl object-fill object-center h-[10rem]"
            />

            {/* ❌ Remove */}
            <Button
              size="sm"
              type="button"
              variant="secondary"
              className="absolute top-0 right-0 rounded-full w-6 h-6 opacity-0 group-hover:opacity-100 transition"
              onClick={() => handleRemoveImage(i)}
            >
              ✕
            </Button>

            {/* ✏️ Edit */}
            <Button
              size="sm"
              type="button"
              variant="outline"
              className="absolute bottom-0 left-0 w-full rounded-none opacity-0 group-hover:opacity-100 transition text-xs"
              onClick={() => fileInputsRef.current[i]?.click()}
            >
              Replace
            </Button>

            {/* hidden input per image */}
            <Input
              type="file"
              accept="image/*"
              hidden
              ref={(el) => (fileInputsRef.current[i] = el)}
              onChange={(e) => handleReplaceImage(i, e.target.files[0])}
            />
          </div>
        ))}
      </div>

      {/* ➕ Upload new image */}
      <Button asChild type="button" variant="outline" className="flex">
        <label htmlFor={dynamicId}>+ Upload Image</label>
      </Button>
      <Input
        id={dynamicId}
        type="file"
        hidden
        multiple
        accept="image/*"
        onChange={(e) => handleAddImage(e.target.files)}
      />
    </div>
  );
}
