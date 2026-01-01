import axios from "axios";
import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 60 });

export async function handleProducts() {
  try {
    const cacheKey = "products";
    const cached = cache.get(cacheKey);

    if (Array.isArray(cached)) {
      console.log("using cached products");
      return { data: cached, error: null };
    }

    const res = await axios.get("/api/products");

    if (!res.data?.success || !Array.isArray(res.data.data)) {
      return { data: [], error: "Products not found" };
    }

    cache.set(cacheKey, res.data.data);
    return { data: res.data.data, error: null };

  } catch (error) {
    console.error(error);
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
    return  error.error;
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
    return  error.error;
  }
}


//update products  data
export async function handleUpdateProductData(id,data){
  try {
    console.log(data);
    const res = await axios.put(`/api/products/edit/${id}`,data);
    const result = res.data;
    if (!result.success) {
      console.log(result.message);
      return;
    }
    return result.message;
  } catch (error) {
    return  error;
  }
}
