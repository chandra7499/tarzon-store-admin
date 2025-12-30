import axios from "axios";
import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 60 });

export async function handleAdmins(){
    try {
        const cacheKey = "admins";
        const data = cache.get(cacheKey);
        if (data) {
            console.log("refetching cache data...");
            console.log(data);
            return data;
        }
        const adminData = await axios.get("/api/admins");
        const res = adminData.data;
        if (!res.success) {
            return res;
        }
        cache.set(cacheKey, res.data);
        console.log(res.data);
        return res.adminInfo;
    } catch (error) {
        console.log(error);
        return error;
    }
}