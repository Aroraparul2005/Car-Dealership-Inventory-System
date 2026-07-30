// Central API client.
// - Reads the JWT from localStorage and sends it as `Authorization: Bearer <token>`.
// - Normalizes the backend's global error shape: { success:false, message, errors }.

const BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export const TOKEN_KEY = "av_token";
export const USER_KEY = "av_user";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors || [];
  }
}

async function request(path, { method = "GET", body, auth = false, isForm = false } = {}) {
  const headers = {};
  if (!isForm && body !== undefined) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = getToken();
    if (!token) throw new ApiError("No token provided", 401);
    headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: isForm ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Cannot reach the server. Is the API running?", 0);
  }

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    const msg = data?.message || data?.errors?.[0] || `Request failed (${res.status})`;
    // A dead/expired JWT should not leave the app in a half-authenticated state.
    if (res.status === 401 && auth) {
      window.dispatchEvent(new CustomEvent("auth:expired"));
    }
    throw new ApiError(msg, res.status, data?.errors);
  }

  return data;
}

/* ---------------------------------- auth --------------------------------- */

export const authApi = {
  register: (payload) => request("/api/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/api/auth/login", { method: "POST", body: payload }),
};

/* -------------------------------- vehicles -------------------------------- */

function qs(params) {
  const sp = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== "") sp.append(k, v);
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export const vehiclesApi = {
  list: (params) => request(`/api/vehicles${qs(params)}`),
  search: (params) => request(`/api/vehicles/search${qs(params)}`),

  // multipart/form-data — the backend expects an `image` file on create.
  create: (formData) =>
    request("/api/vehicles", { method: "POST", body: formData, auth: true, isForm: true }),

  update: (id, payload) =>
    request(`/api/vehicles/${id}`, { method: "PUT", body: payload, auth: true }),

  remove: (id) => request(`/api/vehicles/${id}`, { method: "DELETE", auth: true }),

  purchase: (id, quantity = 1) =>
    request(`/api/vehicles/${id}/purchase`, { method: "POST", body: { quantity }, auth: true }),

  restock: (id, quantity = 1) =>
    request(`/api/vehicles/${id}/restock`, { method: "POST", body: { quantity }, auth: true }),
};
