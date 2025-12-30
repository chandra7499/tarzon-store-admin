"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function SpecificationsSection({ formData, dispatch }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-white/20 p-4 rounded-lg space-y-3"
    >
      <h3 className="font-semibold text-lg">Specifications</h3>

      {formData?.specifications?.map((spec, i) => (
        <div key={i} className="flex gap-3">
          <Input
            placeholder="Key (e.g. Battery)"
            required
            value={spec.key || ""}
            onChange={(e) => {
              const updated = [...formData.specifications];
              updated[i].key = e.target.value;
              dispatch({ type: "SET_FIELD", key: "specifications", value: updated });
            }}
          />
          <Input
            placeholder="Value (e.g. 12h)"
            required
            value={spec.value || ""}
            onChange={(e) => {
              const updated = [...formData.specifications];
              updated[i].value = e.target.value;
              dispatch({ type: "SET_FIELD", key: "specifications", value: updated });
            }}
          />
          <Button
            variant="secondary"
            onClick={() =>
              dispatch({ type: "REMOVE_FROM_ARRAY", key: "specifications", index: i })
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
            key: "specifications",
            value: { key: "", value: "" },
          })
        }
      >
        + Add Specification
      </Button>
    </motion.div>
  );
}
