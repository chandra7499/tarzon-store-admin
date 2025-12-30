"use client";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function DiscountSection({ formData, dispatch }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-white/20 p-4 rounded-lg"
    >
      <h3 className="font-semibold text-lg mb-2">Discount</h3>

      <div className="flex items-center gap-3 mb-3">
        <Switch
         className="bg-gray-200"
          checked={formData.discount.isActive}
          onCheckedChange={(val) =>
            dispatch({
              type: "UPDATE_NESTED",
              parent: "discount",
              key: "isActive",
              value: val,
            })
          }
        />
        <span className="text-sm">
          {formData.discount.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {formData.discount.isActive && (
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            placeholder="Discount %"
            type="number"
            value={formData.discount.percentage || ""}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_NESTED",
                parent: "discount",
                key: "percentage",
                value: Number(e.target.value),
              })
            }
          />
          <Input
            type="date"
            placeholder="Valid Until"
            className="bg-white/35"
            min={new Date(Date.now()).toISOString().split("T")[0]}
            value={formData.discount.validate || ""}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_NESTED",
                parent: "discount",
                key: "validate",
                value: e.target.value,
              })
            }
          />
        </div>
      )}
    </motion.div>
  );
}
