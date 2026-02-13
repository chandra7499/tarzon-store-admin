"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import { handleTrendingBanner } from "@/functions/handleTrendingBanner";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { Trash2, Pencil } from "lucide-react";
import { PopUpSheet } from "../ui/popUps";
import { useDispatch, useSelector } from "react-redux";
import { EditTrendingSheet } from "./EditTrendingSpecific";
import { handleDeleteTrendingBanner } from "@/functions/handleTrendingBanner";
import { extractPublicId } from "@/functions/externalFn";
import { Spinner } from "../ui/spinner";

const TrendingCarousel = () => {
  const dispatch = useDispatch();

  // ✅ GLOBAL STATE
  const trending = useSelector((state) => state.trending.trending);

  const [loading, setLoading] = useState(false);
  const [ImageLoading, setImageLoading] = useState(true);
  const [openEditSheet, setOpenEditSheet] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    async function loadTrending() {
      try {
        // ✅ Same logic as Products
        if (trending.length > 0) return;

        setLoading(true);
        await handleTrendingBanner(dispatch);
      } catch (err) {
        console.error("Trending load failed:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTrending();
  }, [dispatch, trending.length]);

  //Function for Editing

  function handleEdit(item) {
    setOpenEditSheet(true);
    setEditItem(item);
  }

  //function for deleting products

  async function handleDelete(item) {
    try {
      const publicId = extractPublicId(item.image);
      setDeleteLoading(true);
      await handleDeleteTrendingBanner(item.id, publicId);
      alert("Banner deleted successfully please reload the page");
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="p-6  bg-white/15  relative flex backdrop-blur-3xl justify-center   rounded-2xl shadow-lg">
      <div className="absolute right-10 gap-5 flex">
        {/**Popups edit carosel */}
        <PopUpSheet
          descrptive={"Edit your carosel buclicking on the image you seeing"}
          title="Edit Trending"
          type="edit"
          typeTitle="Edit Trending"
          childrenBtn={
            <Button variant="outline" className="rounded-full">
              {<Pencil />}
            </Button>
          }
        >
          {trending?.map((item, index) => (
            <div key={index} className="flex gap-2 group relative">
              <Image
                src={item.image}
                className="aspect-[2/1] shrink rounded-lg"
                alt="alt"
                width={1200}
                height={1200}
              />

              <Button
                variant="outline"
                onClick={() => handleEdit(item)}
                className="
                    rounded-md
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-200
                    absolute
                    right-0
                    p-0
      "
              >
                <Pencil />
              </Button>
            </div>
          ))}
        </PopUpSheet>
        {/**Popups delete carosel */}
        <PopUpSheet
          descrptive={"Delete your carosel by clicking on the image you seeing"}
          title="delete Trending"
          type="delete"
          typeTitle="Delete Trending"
          childrenBtn={
            <Button variant="secondary" className="rounded-full">
              {<Trash2 />}
            </Button>
          }
        >
          {trending?.map((item, index) => (
            <div key={index} className="flex gap-2 group relative">
              <Image
                src={item.image}
                className="aspect-[2/1] rounded-lg"
                alt="alt"
                width={1200}
                height={1200}
              />

              <Button
                variant="secondary"
                onClick={() => handleDelete(item)}
                className="
                    rounded-md
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-200
                    absolute
                    right-0
                    p-0
      "
              >
                {deleteLoading ? (
                  <Spinner className="animate-spin text-slate-950" />
                ) : (
                  <Trash2 />
                )}
              </Button>
            </div>
          ))}
        </PopUpSheet>
      </div>

      <div className="space-y-8  flex-1 max-w-[1200px] ">
        {/* Header */}
        <div className="flex-1 items-center justify-between px-2 md:px-6">
          <h2 className="md:text-3xl flex font-bold tracking-tight text-white">
            🔥 Trending Products{" "}
            {loading && (
              <div className="block text-gray-500 text-md ml-5">
                Fetching...
              </div>
            )}
          </h2>
          <span className="text-sm  text-gray-400 text-muted-foreground">
            Explore what’s popular this week
          </span>
        </div>

        {/* Carousel */}
        <Carousel
          plugins={[
            Autoplay({
              delay: 6000,
            }),
          ]}
          opts={{
            loop: true,
            align: "center",
          }}
          className="w-full max-w-full overflow-hidden"
        >
          <CarouselContent className="w-full">
            {trending?.map((item, index) => (
              <CarouselItem key={item.id} className="w-full">
                {ImageLoading && (
                  <Skeleton className="w-full aspect-[2/1] rounded-3xl bg-white/25" />
                )}

                <motion.div className="flex w-full justify-center">
                  <Card className="w-full max-w-[1200px] overflow-hidden rounded-3xl bg-black p-0">
                    <CardContent className="p-0 relative aspect-[2/1]">
                      <Image
                        src={item.image}
                        alt={item.link}
                        fill
                        onLoad={() => setImageLoading(false)}
                        priority
                        className="object-cover rounded-3xl brightness-90 group-hover:brightness-100 transition-all duration-500"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                      <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="text-xl md:text-3xl font-semibold">
                          {item.link}
                        </h3>
                        <p className="text-sm text-gray-300">
                          Top Pick #{index + 1}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious
            className="
                absolute left-4 top-1/2 -translate-y-1/2
                bg-black/60 hover:bg-black/80
                text-white rounded-full
                w-10 h-10
                backdrop-blur-sm
                z-10
  "
          />
          <CarouselNext
            className="
                absolute right-5 top-1/2 -translate-y-1/2
                bg-black/60 hover:bg-black/80
                text-white rounded-full
                w-10 h-10
                backdrop-blur-sm
                z-10
  "
          />
        </Carousel>
      </div>
      <EditTrendingSheet
        open={openEditSheet}
        setOpen={setOpenEditSheet}
        item={editItem}
      />
    </div>
  );
};

export default TrendingCarousel;
