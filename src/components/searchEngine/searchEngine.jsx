"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HandleSearchEngine } from "@/functions/handleSearchEngine";
export const SearchEngine = () => {
  const [loading, setLoading] = useState(false);
  async function handleUpdate() {
    try {
      setLoading(true);
      const res = await HandleSearchEngine();
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex justify-center items-center w-full">
        <Button disabled={loading} onClick={handleUpdate} variant="outline">
          {loading ? "Updating..." : "Update client search-Engine"}
        </Button>
      </div>
    </>
  );
};
