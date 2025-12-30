import axios from "axios";
import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 60 });

export async function handlePolicies() {
  try {
    const cacheKey = "policies";
    const data = cache.get(cacheKey);

    if (data) {
      console.log("refetching cache data...");
      console.log(data);
      return data;
    }
    const policyData = await axios.get("/api/policies");
    const res = policyData.data;

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

//post new request 

export async function PostHandlePolicies(PostData){
  try {
    console.log(PostData);
    const data = await axios.post("api/policies",PostData);
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

//update request 

export async function PutHandlePolicies(PutData){
  try {
    console.log(PutData);
    const data = await axios.put("api/policies",PutData);
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
