const apiBaseUrl = `${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "")}/api`;

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
