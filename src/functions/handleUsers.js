import axios from "axios";
import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 60 });

export async function handleUsers() {
    try {
        const cacheKey = "users";
        const data = cache.get(cacheKey);

        if (data) {
            console.log("refetching cache data...");
            console.log(data);
            return data;
        }
        const userData = await axios.get("/api/users");
        const res = userData.data;

        if (!res.success) {
            return res;
        }
        cache.set(cacheKey, res.data);
        console.log(res.data);
        return res.userInfo;
    } catch (error) {
        console.log(error);
        return error;
    }
}