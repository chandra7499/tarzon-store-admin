import axios from "axios";

export async function HandleSearchEngine(){
    try {
        const data = await axios.get(`/api/searchengineUpdation`);
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