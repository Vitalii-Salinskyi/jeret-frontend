import { getAccessToken } from "@/utils/tokens";
import axios from "axios";

export const ENDPOINT = import.meta.env.VITE_SERVER_URL;

export const axiosWithAuth = axios.create({
  baseURL: ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosWithAuth.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
