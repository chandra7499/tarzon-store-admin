import axios from "axios";
import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 60 });

export async function handleOffers(){
    try {
        const cacheKey = "offerZone";
                const data = cache.get(cacheKey);
        
                if (data) {
                    console.log("refetching cache data...");
                    console.log(data);
                    return data;
                }
                const orderData = await axios.get(`${process.env.NEXT_BASE_URL}/api/offerZone`);
                const res = orderData.data;
        
                if (!res.success) {
                    return res;
                }
                cache.set(cacheKey, res.offerDocs);
                console.log(res.offerDocs);
                return res.offerDocs;
    } catch (error) {
        return error;
    }
}

export async function PostHandleOfferZone(PostData){
  try {
    const data = await axios.post(`${process.env.NEXT_BASE_URL}api/offerZone`,PostData);
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