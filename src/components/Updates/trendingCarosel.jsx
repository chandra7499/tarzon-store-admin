"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Trash2, Plus, Upload } from "lucide-react";
import Image from "next/image";
import { handleAddTrendingBanner } from "@/functions/handleTrendingBanner";
import { Spinner } from "@/components/ui/spinner";

export default function CarouselManager() {
  const [carousels, setCarousels] = useState([]);
  const [isEmpty,setIsEmpty] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...carousels];
      updated[index].image = reader.result; // base64 preview
      updated[index].file = file; // keep file reference for upload later
      setCarousels(updated);
      setIsEmpty(false);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (index, field, value) => {
    const updated = [...carousels];
    updated[index][field] = value;
    setCarousels(updated);
  };

  const addCarousel = () => {
    setCarousels([...carousels, { image: "", link: "", file: null }]);
  };

  const removeCarousel = (index) => {
    const updated = carousels.filter((_, i) => i !== index);
    setCarousels(updated);
    setIsEmpty(updated.length === 0);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updated = await handleAddTrendingBanner(carousels);
      console.log(updated);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
    // 🚀 Here you can upload images to Firebase Storage and store URLs in Firestore
  };

  return (
    <motion.div
      className="w-full mx-auto p-6  space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-xl w-full bg-gradient-to-br from-black-500 via-gray to-sky-800 max-h-[90vh] overflow-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-indigo-400">
            Trending Banners
          </CardTitle>
          <p className="text-gray-500 text-sm mt-1">
            Upload and manage carousel banners.
          </p>
        </CardHeader>

        <CardContent className="space-y-8 ">
          {carousels.map((item, index) => (
            <motion.div
              key={index}
              className="p-5 rounded-2xl backdrop-blur-3xl bg-white/5 shadow-sm relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="absolute top-3 right-3">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeCarousel(index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 w-full">
                <div>
                  <label className="text-sm text-gray-300 font-medium">
                    search word
                  </label>
                  <Input
                    type="text"
                    value={item.link}
                    onChange={(e) =>
                      handleChange(index, "link", e.target.value)
                    }
                    placeholder="/category/laptops"
                    className="mt-1 text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 font-medium">
                    Upload Image
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <Input
                      type="file"
                      id={`caroselImage-${index}`}
                      hidden
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(index, e.target.files[0])
                      }
                    />

                    <label
                      htmlFor={`caroselImage-${index}`}
                      className="cursor-pointer border-2 text-white p-1 rounded-lg w-full overflow-hidden"
                    >
                      {item.file ? item.file.name : "Upload Image"}
                    </label>

                    <Upload className="text-gray-500" size={18} />
                  </div>
                </div>
              </div>

              {item.image && (
                <Image
                  src={item.image}
                  alt="Preview"
                  width={500}
                  height={500}
                  className="mt-4 rounded-xl w-full h-96 object-cover "
                />
              )}
            </motion.div>
          ))}

          <div className="flex justify-between items-center">
            <Button
              onClick={addCarousel}
              variant="outline"
              className="flex items-center gap-2 border-indigo-300 text-sky-600 hover:bg-indigo-50"
            >
              <Plus size={16} /> Add Carousel
            </Button>

            <Button onClick={handleSave} variant="outline" disabled={loading || isEmpty}>
              <Spinner show={loading} />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
