"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { Button } from "../ui/button";

export default function UploadBrand() {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [banners, setBanners] = useState([]);
  const [bannerPreviews, setBannerPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const toBase64 = (file) =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

  const handleLogoChange = (file) => {
    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleBannerChange = (files) => {
    const fileArray = Array.from(files);
    setBanners(fileArray);
    setBannerPreviews(fileArray.map((file) => URL.createObjectURL(file)));
  };

  const removeBanner = (index) => {
    setBanners((prev) => prev.filter((_, i) => i !== index));
    setBannerPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const isReady = name && logo && banners.length > 0 && !loading;

  async function handleSubmit() {
    if (!isReady) return;

    try {
      setLoading(true);

      const logo64 = await toBase64(logo);
      const banners64 = await Promise.all(banners.map(toBase64));

      await fetch("/api/brands", {
        method: "POST",
        body: JSON.stringify({
          name,
          logo: logo64,
          banners: banners64,
        }),
      });

      alert("Brand Uploaded");

      setName("");
      setLogo(null);
      setLogoPreview(null);
      setBanners([]);
      setBannerPreviews([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black p-10">
      <div className="w-full bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-xl space-y-10">
        <h2 className="text-3xl font-bold text-white">Upload Brand</h2>

        {/* Brand Name */}
        <div>
          <label className="text-sm text-gray-400">Brand Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Apple, Razer..."
            className="w-full mt-2 rounded-xl bg-black/40 border border-gray-700 p-4 text-white outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* Logo */}
        <div>
          <Button asChild variant="outline">
            <label htmlFor="logo" className="text-sm text-gray-400">
              Brand Logo
            </label>
          </Button>
          <input
            type="file"
            id="logo"
            hidden
            accept="image/*"
            onChange={(e) => handleLogoChange(e.target.files[0])}
            className="block mt-2 text-white"
          />

          {logoPreview && (
            <div className="relative w-40 h-40 mt-4 rounded-xl overflow-hidden border border-gray-700">
              <Image alt="logo" src={logoPreview} fill className="object-contain" />
            </div>
          )}
        </div>

        {/* Banners */}
        <div>
        <Button asChild variant="outline"> 
          <label htmlFor="banner" className="text-sm text-gray-400">Brand Banners</label>
        </Button>
          <input
            type="file"
            id="banner"
            multiple
            hidden
            accept="image/*"
            onChange={(e) => handleBannerChange(e.target.files)}
            className="block mt-2 text-white"
          />

          {bannerPreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
              {bannerPreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative aspect-[2/1] rounded-xl overflow-hidden border border-gray-700"
                >
                  <Image alt="banner" src={preview} fill className="object-cover" />

                  <button
                    onClick={() => removeBanner(index)}
                    className="absolute top-2 right-2 bg-black/70 rounded-full p-1 text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          disabled={!isReady}
          onClick={handleSubmit}
          className={`w-full py-4 rounded-xl font-semibold transition flex justify-center items-center gap-3
            ${
              isReady
                ? "bg-white text-black hover:opacity-90"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
        >
          {loading && <Loader2 className="animate-spin" size={20} />}
          {loading ? "Uploading..." : "Upload Brand"}
        </button>
      </div>
    </div>
  );
}
