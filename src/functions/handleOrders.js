import axios from "axios";
import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 60 });

export async function handleOrders(type) {
  try {
    const orderData = await axios.get(`${process.env.NEXT_BASE_URL}/api/orders?type=${type}`);
    const res = orderData.data;

    if (!res.success) {
      return res;
    }
    console.log(res.extendedUserInfo);
    if(type === "Delivered" && !cache.has("deliveredOrders")) {
      cache.set("deliveredOrders", res.extendedUserInfo);
    }
    if(type === "Delivered" && cache.has("deliveredOrders")){
      return cache.get("deliveredOrders")
    }
    return res.extendedUserInfo;

    
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function handleOrderStatusUpdate(orderId, status, userId,value) {
  try {
    const { data } = await axios.put(`${process.env.NEXT_BASE_URL}/api/orders/status/${orderId}`, {
      status,
      userId,
      value
    });
    if (!data.success) {
      console.log(data?.message);
      return data.message;
    }
    console.log(data.messsage);
    return data.message;
  } catch (error) {
    console.log(error);
    return error;
  }
}
