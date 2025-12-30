import React from "react";
import { Switch } from "../ui/switch";
const miniOperations = ({ formData, dispatch }) => {
  return (
    <>
      <section className="border border-white/30 rounded-lg flex flex-col gap-2 p-3">
        <h3 className="font-semibold text-lg mb-2">Conditional Operations</h3>
         {/*Coming soon*/}
        <div className="grid grid-cols-2">
        <div className="flex gap-2 items-center">
        <span className="text-lg text-gray-400">
          coming soon:
        </span>
        <Switch
          className="bg-gray-200"
          checked={formData.comingSoon}
          onCheckedChange={(val) =>
            dispatch({
              type: "SET_FIELD",
              key: "comingsoon",
              value: val,
            })
          }
        />
         <span className="text-sm">
          {formData.comingsoon ? "Active" : "Inactive"}
        </span>
        </div>

        {/*Verified product*/}
        <div className="flex gap-2 items-center">
        <span className="text-lg text-gray-400">
          Verified delar:
        </span>
        <Switch
          className="bg-gray-200"
          checked={formData.verified}
          onCheckedChange={(val) =>
            dispatch({
              type: "SET_FIELD",
              key: "verified",
              value: val,
            })
          }
        />
         <span className="text-sm">
          {formData.verified ? "Active" : "Inactive"}
        </span>
        </div>
        </div>

      </section>
    </>
  );
};

export default miniOperations;
