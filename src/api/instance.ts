import axios, { AxiosInstance } from "axios";

console.log("SERVER URL:", import.meta.env.VITE_SERVER_URL);
export const instance: AxiosInstance = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
