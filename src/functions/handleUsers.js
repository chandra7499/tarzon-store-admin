import axios from "axios";
import { setUsers } from "@/Global_States/userSlice";

export async function handleUsers(dispatch) {
  try {
    const res = await axios.get("/api/users");

    if (!res.data?.success || !Array.isArray(res.data.userInfo)) {
      throw new Error("Users not found");
    }

    dispatch(setUsers(res.data.userInfo));

    return { data: res.data.data, error: null };
  } catch (error) {
    console.error("Fetch users failed:", error);
    return { data: [], error: error.message };
  }
}
