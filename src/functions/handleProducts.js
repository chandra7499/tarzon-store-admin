import axios from "axios";
import { setProducts } from "@/Global_States/productsSlice";

export async function handleProducts(dispatch) {
  try {
    const res = await axios.get("/api/products");

    if (!res.data?.success || !Array.isArray(res.data.data)) 
    {
      throw new Error("Products not found");
    }

    dispatch(setProducts(res.data.data));

    return { data: res.data.data, error: null };
  } catch (error) {
    console.error("Fetch products failed:", error);
    return { data: [], error: error.message };
  }
}

export async function handleAddProduct(data) {
  try {
    const res = await axios.post("/api/products", data);
    const result = await res.data;
    if (!result.success) {
      console.log(result.message);
      return;
    }
    return result.message;
  } catch (error) {
    return error.error;
  }
}

export async function handleEditProductData(id) {
  try {
    const res = await axios.get(`/api/products/edit/${id}`);
    const result = await res.data;
    if (!result.success) {
      console.log(result.message);
      return;
    }
    return result.data;
  } catch (error) {
    return error.error;
  }
}

//update products  data
export async function handleUpdateProductData(id, data) {
  try {
    console.log(data);
    const res = await axios.put(`/api/products/edit/${id}`, data);
    const result = res.data;
    if (!result.success) {
      console.log(result.message);
      return;
    }
    return result.message;
  } catch (error) {
    return error;
  }
}
