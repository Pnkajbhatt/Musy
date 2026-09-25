export const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
export const apiBaseUrl = baseUrl ? `${baseUrl.replace(/\/$/, "")}/api` : "/api";

export function resolveMediaUrl(url) {
  if (!url) return "";
  const backendBase = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");

  // If it points to EC2 domain (e.g. musy-pnkj.duckdns.org), rewrite to the active backendBase or relative
  if (url.includes("musy-pnkj.duckdns.org")) {
    const path = url.replace(/^https?:\/\/musy-pnkj\.duckdns\.org/, "");
    return backendBase ? `${backendBase}${path}` : path;
  }

  // If it's a raw S3 key (e.g. profile/..., Cover/..., Audio/...)
  if (
    url.startsWith("profile/") ||
    url.startsWith("Cover/") ||
    url.startsWith("Audio/") ||
    url.startsWith("profile%2F") ||
    url.startsWith("Cover%2F") ||
    url.startsWith("Audio%2F")
  ) {
    return backendBase
      ? `${backendBase}/api/files/play?fileName=${encodeURIComponent(url)}`
      : `/api/files/play?fileName=${encodeURIComponent(url)}`;
  }

  // If it's a relative path starting with /api/ or api/
  if (url.startsWith("/api/") || url.startsWith("api/")) {
    return backendBase ? `${backendBase}/${url.replace(/^\//, "")}` : url;
  }

  // If it points to an old host with /api/files/play, rewrite to the active backendBase or relative path
  const filesPlayIndex = url.indexOf("/api/files/play");
  if (filesPlayIndex !== -1) {
    return backendBase ? `${backendBase}${url.substring(filesPlayIndex)}` : url.substring(filesPlayIndex);
  }

  // If page is https and url is http, upgrade to https to prevent mixed content blocking
  if (typeof window !== "undefined" && window.location.protocol === "https:" && url.startsWith("http://")) {
    return url.replace(/^http:\/\//, "https://");
  }

  return url;
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;

  // 1. Check cached user object in localStorage
  const cachedUserStr = localStorage.getItem("user");
  if (cachedUserStr) {
    try {
      return JSON.parse(cachedUserStr);
    } catch {
      // ignore
    }
  }

  // 2. Legacy fallback from JWT in localStorage
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const parts = token.split(".");
      if (parts.length >= 2) {
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const parsed = JSON.parse(jsonPayload);
        return {
          username: parsed.sub || localStorage.getItem("username") || "Listener",
          userId: parsed.userId,
          roles: parsed.authorities || ["ROLE_USER"],
        };
      }
    } catch {
      // ignore
    }
  }

  const username = localStorage.getItem("username");
  if (username) {
    return {
      username,
      roles: [localStorage.getItem("role") || "ROLE_USER"],
    };
  }

  return null;
}

// Concurrency lock and queue for silent token refresh
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(error) {
  refreshSubscribers.forEach((cb) => cb(error));
  refreshSubscribers = [];
}

async function apiFetch(url, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const cleanUrl = url.replace(/^\//, "");
  const requestUrl = `${apiBaseUrl}/${cleanUrl}`;

  const fetchOptions = {
    credentials: "include",
    ...options,
    headers,
  };

  const response = await fetch(requestUrl, fetchOptions);

  // If not auth error (401, or 403 when user had a session) or this was already a refresh/login/register attempt, return response
  const hadSession = Boolean(token || localStorage.getItem("role") || localStorage.getItem("user"));
  const isAuthError = response.status === 401 || (response.status === 403 && hadSession);

  if (
    !isAuthError ||
    cleanUrl.startsWith("auth/refresh") ||
    cleanUrl.startsWith("auth/login") ||
    cleanUrl.startsWith("auth/register")
  ) {
    return response;
  }

  // If already refreshing, wait for ongoing refresh then retry original request
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((refreshErr) => {
        if (refreshErr) {
          resolve(response); // return the original response if refresh failed
        } else {
          const latestToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
          const retryHeaders = { ...fetchOptions.headers };
          if (latestToken) {
            retryHeaders.Authorization = `Bearer ${latestToken}`;
          }
          resolve(fetch(requestUrl, { ...fetchOptions, headers: retryHeaders }));
        }
      });
    });
  }

  // Initiate refresh
  isRefreshing = true;

  try {
    const refreshRes = await fetch(`${apiBaseUrl}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (refreshRes.ok) {
      const refreshData = await refreshRes.json().catch(() => null);
      if (refreshData?.data) {
        const u = refreshData.data;
        localStorage.setItem("user", JSON.stringify(u));
        if (u.username) {
          localStorage.setItem("username", u.username);
        }
        if (u.role) {
          localStorage.setItem("role", u.role);
        }
        if (u.token) {
          localStorage.setItem("token", u.token);
        }
      }
      onRefreshed(null);
      // Retry the original request with updated token
      const latestToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const retryHeaders = { ...fetchOptions.headers };
      if (latestToken) {
        retryHeaders.Authorization = `Bearer ${latestToken}`;
      }
      return fetch(requestUrl, { ...fetchOptions, headers: retryHeaders });
    } else {
      // Refresh failed: clear user and broadcast logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      window.dispatchEvent(new Event("auth-change"));
      onRefreshed(new Error("Refresh failed"));
      return response;
    }
  } catch (err) {
    onRefreshed(err);
    return response;
  } finally {
    isRefreshing = false;
  }
}

export default apiFetch;
