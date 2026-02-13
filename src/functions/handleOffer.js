import axios from "axios";
import { setOffers } from "@/Global_States/offerSlice";

/**
 * Fetch offers and store them in Redux (global cache)
 */
export async function handleOffers(dispatch) {
  try {
    const res = await axios.get("/api/offerZone");

    if (!res.data?.success || !Array.isArray(res.data.offerDocs)) {
      throw new Error("Offer data not found");
    }

    // ✅ Store in Redux (global)
    dispatch(setOffers(res.data.offerDocs));

    return { data: res.data.offerDocs, error: null };
  } catch (error) {
    console.error("Fetch offers failed:", error);
    return { data: [], error: error.message };
  }
}

export async function PostHandleOfferZone(PostData){
  try {
    const data = await axios.post(`/api/offerZone`,PostData);
    const res =  data?.data;
    if(!res?.success){
       console.log(res.message);
       return res.message;
    }
    console.log(res?.messsage);
    return res.message;
  } catch (error) {
    console.log(error);
    return error;
  }
}