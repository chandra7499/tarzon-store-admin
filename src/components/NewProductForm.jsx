"use client";
import { useReducer,useState } from "react";
import { Button } from "@/components/ui/button";
import Form from "@/components/ui/form";
import BrandSection from "./productsFormSections/BrandSection";
import DiscountSection from "./productsFormSections/DiscountSection";
import TagsSection from "./productsFormSections/Tags";
import ImagesSection from "./productsFormSections/Images";
import VariantsSection from "./productsFormSections/VariantsSection";
import FeaturesSection from "./productsFormSections/FeaturesSection";
import SpecificationsSection from "./productsFormSections/SpecificationsSection";
import MiniOperations from "./productsFormSections/miniOperations";
import { handleAddProduct } from "@/functions/handleProducts";
import { Spinner } from "./ui/spinner";

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
  features: [{ title: "", value: [""],images:[] }],
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
    default:
      return state;
  }
}

export default function NewProductForm() {
  const [formData, dispatch] = useReducer(reducer, initialState);
  const [isLoading,setLoading] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      console.log(formData);
      setLoading(true);
      const submission = await handleAddProduct(formData);
      console.log(submission); 
    } catch (error) {
      console.log("product error",error);
    }finally{
      setLoading(false);
    }
    
  };

  return (
    <Form
      handleFn={handleSubmit}
      className="flex flex-col gap-6 bg-black/20 backdrop-blur-2xl text-white rounded-xl shadow-lg lg:p-8 p-2 max-w-4xl mx-auto"
    >
      <h1 className="text-2xl font-semibold text-center mb-4">
        Add New Product
      </h1>

      {/* Sections */}
      <BrandSection formData={formData} dispatch={dispatch} />
      <DiscountSection formData={formData} dispatch={dispatch} />
      <MiniOperations formData={formData} dispatch={dispatch}/>
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
        <Spinner show={isLoading}/>
        Submit Product
      </Button>
    </Form>
  );
}
