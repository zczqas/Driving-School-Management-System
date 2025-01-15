import axios, { AxiosRequestHeaders } from "axios";

// Use environment variable for API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not defined');
}

const instance = axios.create({
  baseURL: API_URL,
});

export const setAuthToken = (token?: string) => {
  if (token) {
    instance.defaults.headers["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers["Authorization"];
  }
};

instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers = config.headers || ({} as AxiosRequestHeaders);
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        const response = await axios.post(
          `${API_URL}/auth/token/refresh-token?refresh_token=${refreshToken}`
        );
        if (response.status === 200) {
          localStorage.setItem("access_token", response.data.access_token);
          return instance(originalRequest);
        }
        if (response.status === 401) {
          redirectToLogin();
        }
      }
    }
    if (error.response.status === 403) {
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

const redirectToLogin = () => {
  localStorage.clear();
  window.location.href = "/login";
};

export default instance;