import axios from "axios";
import { setAdmins } from "@/Global_States/adminsSlice";

export async function handleAdmins(dispatch) {
  try {
    const res = await axios.get("/api/admins");

    if (!res.data?.success || !Array.isArray(res.data.adminInfo)) {
      console.log("Admins not found");
      return;
    }

    dispatch(setAdmins(res.data.adminInfo));
    return { data: res.data.data, error: null };
  } catch (error) {
    console.error("Fetch admins failed:", error);
    return { data: [], error: error.message };
  }
}

export async function handleTotalRevenue() {
  try {
    const { data } = await axios.get("/api/admins/revenue"); // ✅ correct path

    if (!data?.success) {
      console.log(data?.message || "Revenue fetch failed");
      return;
    }
    console.log(data);
    return data; // ✅ return full payload
  } catch (error) {
    console.error("handleTotalRevenue error:", error);
    return { success: false, revenue: null };
  }
}
