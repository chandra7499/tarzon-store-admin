"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

export default function BrandSection({ formData, dispatch }) {
  const [ImageName, setImageName] = useState(null);
  const handleFileChange = (key, file) => {
    if(!file){
      return;
    }
    const baseUrl = new FileReader();
    let url;
    baseUrl.onloadend = () => {
      url = baseUrl.result;
      dispatch({ type: "UPDATE_NESTED", parent: "brand", key, value: url });
    }
    baseUrl.readAsDataURL(file);
    setImageName(file.name);
  };

  return (
    <div className="border border-white/20 p-4 rounded-lg space-y-4">
      <h3 className="font-semibold text-lg">Brand Details</h3>

      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Brand Name"
          required
          value={formData.brand.brandName || ""}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_NESTED",
              parent: "brand",
              key: "brandName",
              value: e.target.value,
            })
          }
        />
        <Input
          placeholder="Category"
          required
          value={formData.category || ""}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              key: "category",
              value: e.target.value,
            })
          }
        />
      </div>

      {/* Logo & Banner */}
      <div className="grid md:grid-cols-2  gap-4">
        {["Banner"].map((key) => (
          <div
            key={key}
            className="flex items-center col-span-2 justify-between border p-2 rounded-lg gap-3"
          >
            <Image
              src={formData.brand[key] || "/globe.svg"}
              alt={key}
              width={100}
              height={100}
              className="rounded-lg object-contain w-20 h-20"
            />
            <p className="text-xs truncate">{ImageName}</p>

            <Button asChild variant="outline">
              <label htmlFor={`brand-${key}`}>Upload {key}</label>
            </Button>

            <Input
              type="file"
              id={`brand-${key}`}
              hidden
              onChange={(e) => handleFileChange(key, e.target.files[0])}
            />
          </div>
        ))}
        <Input type="text" value={formData.name} placeholder="title" className="col-span-2" onChange={(e) => dispatch({ type: "SET_FIELD", key: "name", value: e.target.value })}/>
        <Input type="number" value={formData.stock} placeholder="stock" onChange={(e) => dispatch({ type: "SET_FIELD", key: "stock", value: Number(e.target.value)})}/>
        <Input type="number"  value={formData.price} placeholder="price"  onChange={(e) => dispatch({ type: "SET_FIELD", key: "price", value:Number(e.target.value) })}/>
        <textarea rows={6} placeholder="description" value={formData.description} onChange={(e)=>dispatch({ type: "SET_FIELD", key: "description", value: e.target.value})}  className="w-full min-h-[180px] border-1 p-2 col-span-2 rounded-lg "/>
      </div>
    </div>
  );
}
