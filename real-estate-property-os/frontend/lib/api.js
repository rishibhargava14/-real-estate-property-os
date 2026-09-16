import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

export const UPLOADS_URL = process.env.NEXT_PUBLIC_UPLOADS_URL || "http://localhost:5000";

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("companyId");
      localStorage.removeItem("companyName");
      localStorage.removeItem("subdomain");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

export function getCompanyId() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("companyId") || "";
}

// Resolves a stored image path (as returned by multer, e.g. "/uploads/properties/x.jpg")
// against the backend's origin, so <img> tags work without the frontend proxying uploads.
export function resolveUpload(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${UPLOADS_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
