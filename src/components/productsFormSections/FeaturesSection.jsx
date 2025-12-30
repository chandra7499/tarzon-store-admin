"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImagesSection from "./Images";
import { motion } from "framer-motion";

export default function FeaturesSection({ formData, dispatch }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-white/20 p-4 rounded-lg space-y-4"
    >
      <h3 className="font-semibold text-lg">Features</h3>

      {formData.features.map((feature, i) => (
        <div
          key={i}
          className="border border-white/30 p-3 rounded-lg space-y-4"
        >
          {/* Feature Title */}
          <Input
            placeholder="Feature Title"
            value={feature.title}
            onChange={(e) => {
              const updated = [...formData.features];
              updated[i].title = e.target.value;
              dispatch({
                type: "SET_FIELD",
                key: "features",
                value: updated,
              });
            }}
          />

          {/* Feature Points Section */}
          <div className="space-y-2 border border-white/30 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground font-medium">
              Feature Points
            </p>

            {feature.value.map((point, j) => (
              <div key={j} className="flex gap-2">
                <Input
                  placeholder="Feature detail"
                  required
                  value={point || ""}
                  onChange={(e) => {
                    const updated = [...formData.features];
                    updated[i].value[j] = e.target.value;
                    dispatch({
                      type: "SET_FIELD",
                      key: "features",
                      value: updated,
                    });
                  }}
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    const updated = [...formData.features];
                    updated[i].value.splice(j, 1);
                    dispatch({
                      type: "SET_FIELD",
                      key: "features",
                      value: updated,
                    });
                  }}
                >
                  ×
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const updated = [...formData.features];
                updated[i].value.push("");
                dispatch({
                  type: "SET_FIELD",
                  key: "features",
                  value: updated,
                });
              }}
            >
              + Add Point
            </Button>
          </div>

          <div className="border border-white/30 p-3 rounded-lg">
            <ImagesSection
              formData={formData}
              dispatch={dispatch}
              title={"Feature Images"}
              dynamicId={`add-feature-images-${i + 1}`}
              Key={"images"}
              featureIndex={i}
            />
          </div>

          {/* Remove Whole Feature */}
          <Button
            variant="secondary"
            className="flex w-full"
            onClick={() =>
              dispatch({
                type: "REMOVE_FROM_ARRAY",
                key: "features",
                index: i,
              })
            }
          >
            Remove Feature
          </Button>
        </div>
      ))}

      {/* Add New Feature */}
      <Button
        variant="outline"
        onClick={() =>
          dispatch({
            type: "ADD_TO_ARRAY",
            key: "features",
            value: { title: "", value: [""], images: [] },
          })
        }
      >
        + Add Feature
      </Button>
    </motion.div>
  );
}
