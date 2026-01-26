
import { store } from "@/store/store";
import axios from "axios";

export interface ApiError {
  response: {
    data: {
      message: string;
    };
  };
}

interface AuthState {
  user: {
    accessToken: string;
  } | null;
}
interface RootState {
  auth: AuthState;
}

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL!,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

http.interceptors.request.use((config) => {
  const state = (store.getState() as unknown) as RootState;
  const token = state.auth?.user?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      fetch("/api/logout");
      globalThis.location.href = "/auth";
    }
    return Promise.reject(error);
  },
);

export default http;
