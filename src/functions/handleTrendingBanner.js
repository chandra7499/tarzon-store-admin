import axios from "axios";
import { setTrending } from "@/Global_States/trendingSlice";

export async function handleTrendingBanner(dispatch) {
  try {
    const res = await axios.get("/api/trendingbanner");

    if (!res.data?.success || !Array.isArray(res.data.data)) {
      throw new Error("Trending data not found");
    }

    // Flatten once here (not in component)
    const flattened = res.data.data.flatMap((doc) => doc?.items || []);

    dispatch(setTrending(flattened));

    return { data: flattened, error: null };
  } catch (error) {
    console.error("Fetch trending failed:", error);
    return { data: [], error: error.message };
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

export async function handleEditTrendingBanner(
  id,
  imageData = null, // base64 | null
  publicId,
  newLink,
) {
  try {
    if (!id) {
      console.log("Banner ID is required");
    }

    // 🧠 Build payload dynamically
    const payload = {
      publicId,
      link: newLink,
    };

    // 🔁 Only include image if user selected a new one
    if (imageData) {
      payload.imageData = imageData;
    }

    const res = await axios.put(`/api/trendingbanner/${id}`, payload);

    return {
      success: true,
      message: res.data?.message || "Banner updated successfully",
    };
  } catch (error) {
    console.error("Edit trending banner failed:", error);

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong while updating banner",
    };
  }
}

export async function handleDeleteTrendingBanner(id, publicId) {
  try {
    const res = await axios.delete(
      `/api/trendingbanner/delete/${id}`,
      { data: { publicId } },
    );

    return res.data;
  } catch (error) {
    console.error("Delete banner failed:", error);

    return {
      success: false,
      message:
        error?.response?.data?.message || error.message || "Delete failed",
    };
  }
}
