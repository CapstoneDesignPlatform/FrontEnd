import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { isPublicAuthRequest, shouldExpireSession } from "./authRequestPolicy";
import { clearAuthTokens, getStoredAccessToken } from "./authTokens";


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
    const token = getStoredAccessToken();

    if (token && config.headers && !isPublicAuthRequest(config.url)) {
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
    if (axios.isAxiosError(error) && error.response?.status === 401
      && shouldExpireSession(error.config?.url ?? "", error.config?.headers?.Authorization, getStoredAccessToken())) {
      clearAuthTokens();
      window.location.href = window.location.pathname.startsWith('/admin') ? '/admin/login' : '/login';
    }
    return Promise.reject(error);
  },
);