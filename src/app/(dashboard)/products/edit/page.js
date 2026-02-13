"use client";

import { useReducer, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Form from "@/components/ui/form";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import SideBar from "@/components/SideBar";
import BrandSection from "@/components/productsFormSections/BrandSection";
import DiscountSection from "@/components/productsFormSections/DiscountSection";
import MiniOperations from "@/components/productsFormSections/miniOperations";
import TagsSection from "@/components/productsFormSections/Tags";
import ImagesSection from "@/components/productsFormSections/Images";
import VariantsSection from "@/components/productsFormSections/VariantsSection";
import FeaturesSection from "@/components/productsFormSections/FeaturesSection";
import SpecificationsSection from "@/components/productsFormSections/SpecificationsSection";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  handleEditProductData,
  handleUpdateProductData,
} from "@/functions/handleProducts";

// ✅ Define your initial state
const initialState = {
  brand: { Banner: "", brandName: "", logo: "" },
  tags: [""],
  discount: { isActive: false, percentage: 0, validate: "" },
  images: [],
  name: "",
  price: "",
  rating: "",
  stock: "",
  category: "",
  description: "",
  variants: [{ color: "", price: "", stock: "" }],
  specifications: [{ key: "", value: "" }],
  features: [{ title: "", value: [""], images: [] }],
  comingsoon: false,
  verified: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.key]: action.value };
    case "UPDATE_NESTED":
      return {
        ...state,
        [action.parent]: {
          ...state[action.parent],
          [action.key]: action.value,
        },
      };
    case "ADD_TO_ARRAY":
      return { ...state, [action.key]: [...state[action.key], action.value] };
    case "REMOVE_FROM_ARRAY":
      return {
        ...state,
        [action.key]: state[action.key].filter((_, i) => i !== action.index),
      };
    case "RESET":
      return initialState;
    case "LOAD_DATA":
      return { ...state, ...action.payload }; // ✅ used to load fetched data
    default:
      return state;
  }
}

export default function Editpage() {
  const [formData, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setLoading] = useState(false);
  const [fetching,setFetching] = useState(false);
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  // ✅ Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        setFetching(true);
        const productData = await handleEditProductData(productId);
        dispatch({ type: "LOAD_DATA", payload: productData }); // ✅ update reducer state
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
        setFetching(false);
      }
    };
    fetchProductData();
  }, [productId]);

  async function handleEditProduct(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const submission = await handleUpdateProductData(productId,formData);
      console.log(submission);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    // <SidebarProvider>
    //   <SideBar />
    //   <SidebarTrigger className="cursor-pointer sticky top-1" />
      <main className="w-full">
        <Form
          handleFn={handleEditProduct}
          className="flex flex-col gap-6 bg-black/20 backdrop-blur-2xl text-white rounded-xl shadow-lg lg:p-8 p-2 max-w-4xl mx-auto"
        >
          <h1 className="text-2xl font-semibold text-center mb-4">
            Edit Product
          </h1>
          {fetching && <span className="text-gray-600 flex w-full justify-center items-center">Fetching...</span>}

          {/* Sections */}
          <BrandSection formData={formData} dispatch={dispatch} />
          <DiscountSection formData={formData} dispatch={dispatch} />
          <MiniOperations formData={formData} dispatch={dispatch} />
          <TagsSection formData={formData} dispatch={dispatch} />
          <ImagesSection formData={formData} dispatch={dispatch} />
          <VariantsSection formData={formData} dispatch={dispatch} />
          <SpecificationsSection formData={formData} dispatch={dispatch} />
          <FeaturesSection formData={formData} dispatch={dispatch} />

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Spinner show={isLoading} />
            update
          </Button>
        </Form>
      </main>
    // </SidebarProvider>
  );
}
