import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/auth";

export const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token from localStorage if available as fallback for cookie
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("prepai_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function register({ username, email, password }) {
  const response = await authApi.post("/register", { username, email, password });
  if (response.data?.token) {
    localStorage.setItem("prepai_token", response.data.token);
  }
  return response.data;
}

export async function login({ email, password }) {
  const response = await authApi.post("/login", { email, password });
  if (response.data?.token) {
    localStorage.setItem("prepai_token", response.data.token);
  }
  return response.data;
}

export async function logout() {
  try {
    const response = await authApi.get("/logout");
    localStorage.removeItem("prepai_token");
    return response.data;
  } catch (err) {
    localStorage.removeItem("prepai_token");
    throw err;
  }
}

export async function getme() {
  const response = await authApi.get("/get-me");
  return response.data;
}
