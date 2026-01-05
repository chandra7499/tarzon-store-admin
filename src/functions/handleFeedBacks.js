import axios from "axios";
import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 60 });

export async function handleFeedBacks(){
    try {
        const cacheKey = "feedbacks";
        const data = cache.get(cacheKey);
        if (data) {
            console.log("refetching cache data...");
            console.log(data);
            return data;
        }
        const feedbackData = await axios.get(`${process.env.NEXT_BASE_URL}/api/feedbacks`);
        const res = feedbackData.data;
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

export async function handleReplay(replayText,id,docId){
    try {
        const res = await axios.put(`${process.env.NEXT_BASE_URL}/api/feedbacks/${id}`, {replayText,docId});
        const result = await res.data;
        if (!result.success) {
            return result;
        }
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }
}