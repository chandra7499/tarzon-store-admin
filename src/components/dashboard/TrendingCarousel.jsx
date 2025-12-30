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

const TrendingCarousel = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ImageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    async function getTrending() {
      setLoading(true);
      const result = await handleTrendingBanner();
      if (result.error) {
        setTrending([]);
        setLoading(false);
        return;
      }
      setTrending(result?.data.flatMap((doc) => doc.items));
      setLoading(false);
      console.log(result?.data);
    }
    getTrending();
  }, []);

  useEffect(() => {
    console.log(trending);
  }, [trending]);

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
            <Image
              src={item.image}
              key={index}
              className="aspect-[2/1] rounded-lg "
              alt="alt"
              width={1500}
              height={1500}
            />
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
            <Image
              src={item.image}
              key={index}
              className="aspect-[2/1] rounded-lg"
              alt="alt"
              width={1500}
              height={1500}
            />
          ))}
        </PopUpSheet>
      </div>

      <div className="space-y-8 flex-1 max-w-[1400px] ">
        {/* Header */}
        <div className="flex-1 items-center justify-between px-2 md:px-6">
          <h2 className="md:text-3xl flex font-bold tracking-tight text-white">
            🔥 Trending Products    {loading && <div className="block text-gray-500 text-md ml-5">Fetching...</div>}
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
          className="max-w-[1400px] h-[33rem] justify-center  flex "
        >
          <CarouselContent>
            {trending?.map((item, index) => (
              <CarouselItem key={item.id} className="basis-full">
                {ImageLoading && (
                  <Skeleton className="w-full h-[33rem] rounded-3xl bg-white/25 z-[99999]" />
                )}

                <motion.div
                  whileHover={{ scale: 1.0 }}
                  className={"flex w-full h-[36rem] justify-center "}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="group  border-none shadow-2xl min-w-[12rem]  max-h-[33rem]  max-w-[1200px]  w-full overflow-hidden rounded-3xl bg-black p-0">
                    <CardContent className="p-0 relative max-w-[1200px]  max-h-[33rem]">
                   
                      <Image
                        src={item.image}
                        alt={item.link}
                        width={1300}
                        height={900}
                        onLoad={() => setImageLoading(false)}
                        loading="eager"
                        priority
                        className="object-fill object-center    w-full  h-[34rem] rounded-3xl brightness-90 group-hover:brightness-100 transition-all duration-500"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                      {/* Title */}
                      <div className="absolute bottom-8 left-8 text-white">
                        <h3 className="text-xl md:text-3xl font-semibold drop-shadow-lg">
                          {item.link}
                        </h3>
                        <p className="text-sm text-gray-300 mt-1">
                          Top Pick #{index + 1}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation buttons */}
          <CarouselPrevious className="md:flex hidden absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10 backdrop-blur-sm" />
          <CarouselNext className="hidden md:flex  absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10 backdrop-blur-sm" />
        </Carousel>
      </div>
    </div>
  );
};

export default TrendingCarousel;
