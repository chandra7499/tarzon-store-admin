import axios from "axios";
import { setFeedbacks } from "@/Global_States/feedbackSlice";

export async function handleFeedBacks(dispatch) {
  try {
    const res = await axios.get("/api/feedbacks");

    if (!res.data?.success || !Array.isArray(res.data.data)) {
      throw new Error("Feedbacks not found");
    }

    dispatch(setFeedbacks(res.data.data));
    return { data: res.data.data, error: null };
  } catch (error) {
    console.error("Fetch feedbacks failed:", error);
    return { data: [], error: error.message };
  }
}


export async function handleReplay(replayText,id,docId){
    try {
        const res = await axios.put(`/api/feedbacks/${id}`, {replayText,docId});
        const result = await res.data;
        if (!result.success) {
            return result;
        }
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }
}