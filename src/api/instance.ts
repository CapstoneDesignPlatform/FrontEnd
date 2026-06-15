import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const JWT_TOKEN_KEY = "ACCESS_TOKEN";

export const instance: AxiosInstance = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const userInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

userInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = Cookies.get(JWT_TOKEN_KEY);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  },
);

userInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      Cookies.remove('ACCESS_TOKEN');
      Cookies.remove('USER_ROLE');
      Cookies.remove('CLIENT_INFO_ID');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);