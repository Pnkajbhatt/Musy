const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
const apiBaseUrl = `${baseUrl.replace(/\/$/, "")}/api`;

export function resolveMediaUrl(url) {
  if (!url) return "";
  const backendBase = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");

  // If it's a relative path starting with /api/ or api/
  if (url.startsWith("/api/") || url.startsWith("api/")) {
    return backendBase ? `${backendBase}/${url.replace(/^\//, "")}` : url;
  }

  // If it points to an old host with /api/files/play, rewrite to the active backendBase
  const filesPlayIndex = url.indexOf("/api/files/play");
  if (filesPlayIndex !== -1 && backendBase) {
    return `${backendBase}${url.substring(filesPlayIndex)}`;
  }

  // If page is https and url is http, upgrade to https to prevent mixed content blocking
  if (typeof window !== "undefined" && window.location.protocol === "https:" && url.startsWith("http://")) {
    return url.replace(/^http:\/\//, "https://");
  }

  return url;
}

async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${apiBaseUrl}/${url.replace(/^\//, "")}`, {
    ...options,
    headers,
  });
}

export default apiFetch;
