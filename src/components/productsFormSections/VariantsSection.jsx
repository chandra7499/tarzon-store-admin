"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function VariantsSection({ formData, dispatch }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-white/20 p-4 rounded-lg space-y-3"
    >
      <h3 className="font-semibold text-lg">Variants</h3>

      {formData.variants.map((variant, i) => (
        <div
          key={i}
          className="grid md:grid-cols-3 gap-3 border p-3 rounded-lg  bg-white/10"
        >
          {Object.keys(variant).map((key) => (
            <Input
              key={key}
              required
              placeholder={`Enter ${key}`}
              value={variant[key] || ""}
              onChange={(e) => {
                const newVariants = [...formData.variants];
                newVariants[i][key] = typeof e.target.value === "number" ? Number(e.target.value) : e.target.value;
                dispatch({ type: "SET_FIELD", key: "variants", value: newVariants });
              }}
            />
          ))}

          <Button
            variant="secondary"
            className="flex w-max ml-auto mr-0 col-span-3"
            onClick={() =>
              dispatch({ type: "REMOVE_FROM_ARRAY", key: "variants", index: i })
            }
          >
            Remove
          </Button>
        </div>
      ))}

      <Button
        variant="outline"
        onClick={() =>
          dispatch({
            type: "ADD_TO_ARRAY",
            key: "variants",
            value: { color: "", price: "", stock: "" },
          })
        }
      >
        + Add Variant
      </Button>
    </motion.div>
  );
}
