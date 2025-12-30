"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TagsSection({ formData, dispatch }) {
  return (
    <div className="border border-white/20 p-4 rounded-lg">
      <h3 className="font-semibold text-lg mb-2">Tags</h3>
      <div className="space-y-3">
        {formData.tags.map((tag, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={tag || ""}
              required
              onChange={(e) => {
                const newTags = [...formData.tags];
                newTags[i] = e.target.value;
                dispatch({ type: "SET_FIELD", key: "tags", value: newTags });
              }}
              placeholder="Enter tag"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                dispatch({ type: "REMOVE_FROM_ARRAY", key: "tags", index: i })
              }
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => dispatch({ type: "ADD_TO_ARRAY", key: "tags", value: "" })}
        >
          + Add Tag
        </Button>
      </div>
    </div>
  );
}
