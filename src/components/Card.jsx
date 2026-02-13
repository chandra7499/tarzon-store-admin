import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const Card = ({Key,id,Title, image, details }) => {
  const router = useRouter(); 
  function handleEdit(productId){
    router.push(`/products/edit?id=${productId}`);
   } 

  return (
    <>
      <section className="flex flex-col  rounded-lg p-2  items-center h-full ring-1 ring-white/15 gap-2 bg-black" key={Key}>
        <div className="w-full line-clamp-1 p-1"> {Title}</div>
        <div className="flex grow shrink-0">
          <Image className="rounded-lg" src={image || "/Gemini_Generated_Image_v6ogtav6ogtav6og (1).png"} priority loading="eager" width={250} height={250} alt={Title || "users"}/>
        </div>
        <div>{details.toLocaleString("en-IN")}</div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={()=>handleEdit(id)}  className="cursor-pointer">Edit</Button>
          <Button variant="secondary" className="cursor-pointer">Delete</Button>

        </div>
      </section>
    </>
  );
};

export default Card;
