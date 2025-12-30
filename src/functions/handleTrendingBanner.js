import axios from "axios";

export async function handleTrendingBanner() {
  try {
    const res = await axios.get("/api/trendingbanner");
    const result = res.data;
    if (!result.success) {
      console.log("trending products not found");
      return;
    }
    return { data: result.data };
  } catch (error) {
    return { error: error.message };
  }
}

export async function handleAddTrendingBanner(data) {
  try {
    console.log(data);
    const res = await axios.post("/api/trendingbanner", data);
    const result = await res.data;
    if (!result.success) {
      console.log(result);
      return;
    }
    return result.message;
  } catch (error) {
    return { error: error.message };
  }
}
