"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { handleEditTrendingBanner } from "@/functions/handleTrendingBanner";
import {extractPublicId} from "@/functions/externalFn";



export function EditTrendingSheet({ open, setOpen, item }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [saving, setSaving] = useState(false);

  /* =========================
     INIT FROM ITEM
  ========================= */
  useEffect(() => {
    if (item) {
      setLink(item.link || "");
    }
  }, [item]);

  /* =========================
     CLEANUP OBJECT URL
  ========================= */
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (!item) return null;

  /* =========================
     RESET TEMP STATE
  ========================= */
  const resetTempState = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
    setLink(item.link || "");
  };

  /* =========================
     SHEET CLOSE HANDLER
  ========================= */
  const handleOpenChange = (value) => {
    if (!value) resetTempState();
    setOpen(value);
  };

  /* =========================
     FILE → BASE64
  ========================= */
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  /* =========================
     SAVE HANDLER
  ========================= */
  const handleSave = async () => {
  if (!file && link === item.link) return;

  try {
    setSaving(true);

    let imageBase64 = null;
    if (file) {
      imageBase64 = await fileToBase64(file);
    }

    // 🔥 Extract Cloudinary public_id from OLD image URL
    const publicId = extractPublicId(item.image);

    await handleEditTrendingBanner(
      item.id,
      imageBase64,
      publicId,   // ✅ REAL public_id
      link
    );

    resetTempState();
    setOpen(false);
  } catch (err) {
    console.error("Save failed:", err);
  } finally {
    setSaving(false);
  }
};

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="h-[89%] p-4">
        <SheetHeader>
          <SheetTitle>Edit Trending Banner</SheetTitle>
          <SheetDescription className="font-semibold text-2xl">
            Replace image or update link
          </SheetDescription>
        </SheetHeader>

        {/* IMAGES */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <p className="text-sm text-gray-400 mb-2">Current Image</p>
            <Image
              src={item.image}
              alt="current"
              width={600}
              height={300}
              className="rounded-lg aspect-[2/1]"
            />
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-2">New Image Preview</p>
            {preview ? (
              <Image
                src={preview}
                alt="preview"
                width={600}
                height={300}
                className="rounded-lg aspect-[2/1]"
              />
            ) : (
              <div className="h-[150px] flex items-center justify-center rounded-lg border border-dashed">
                No image selected
              </div>
            )}
          </div>
        </div>

        {/* INPUTS */}
        <div className="space-y-4 mt-6">
          <input
            type="file"
            hidden
            id="EditImage"
            accept="image/*"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (!selected) return;

              if (preview) URL.revokeObjectURL(preview);

              setFile(selected);
              setPreview(URL.createObjectURL(selected));
            }}
          />

          <Button asChild variant="outline" className="w-full">
            <label htmlFor="EditImage">Upload New Image</label>
          </Button>

          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Edit redirect link"
            className="w-full p-2 rounded-md bg-black/40 border"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            variant="outline"
            disabled={saving || (!file && link === item.link)}
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
