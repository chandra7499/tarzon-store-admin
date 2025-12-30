import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_BASE_URL ||
    (typeof window === "undefined"
      ? "http://localhost:3000" // for server-side
      : window.location.origin), // for client-side
});

export default axiosInstance;