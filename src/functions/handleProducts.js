import axios from "axios";
import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 60 });

export async function handleProducts() {
  try {
    const cacheKey = "products";
    const data = cache.get(cacheKey);

    if (data) {
      console.log("refetching cache data...");
      console.log(data);
      return data;
    }
    const productData = await axios.get("/api/products");
    const res = productData.data;

    if (!res.success) {
      return res;
    }
    cache.set(cacheKey, res.data);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
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
