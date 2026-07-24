import axios from "axios";

const api = axios.create({
  baseURL:"https://anfit-backend.onrender.com/api",
});

// Request interceptor (attach token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
   if (error.response?.status === 401) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.dispatchEvent(new Event("authChange"));

  window.location.href = "/login";
}

    return Promise.reject(error);
  }
);

export default api;
