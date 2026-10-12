import axios from "axios";
import { API_BASE_URL } from "../config/env";
import store from "../zustand/loginStore";

// Shared client for dashboard requests. Reads the token per request, exactly
// like the previous per-component `Authorization: Bearer ${localStorage...}`.
const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Requests that 401 at the same time share one refresh: the backend rotates
// refresh tokens, so parallel refreshes would invalidate each other.
let refreshing = null;
const refreshSession = () =>
  (refreshing ??= axios
    .post(`${API_BASE_URL}/users/refreshtoken`, { refreshToken: localStorage.getItem("refreshToken") })
    .then(({ data }) => {
      const { accessToken, refreshToken } = data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      store.getState().updateAccessToken(accessToken);
      return accessToken;
    })
    .finally(() => {
      refreshing = null;
    }));

// Clearing the persisted session is what stops /login from redirecting
// straight back to the dashboard (the old 401 redirect loop).
const endSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  store.getState().logoutUser();
};

// Expired access token: refresh once and retry. Refresh token expired too: sign out.
api.interceptors.response.use(undefined, async (error) => {
  const original = error.config;
  if (error.response?.status !== 401 || !original) throw error;
  if (!original._retry) {
    original._retry = true;
    try {
      original.headers.Authorization = `Bearer ${await refreshSession()}`;
      return await api(original);
    } catch {
      // fall through to sign out
    }
  }
  endSession();
  throw error;
});

export default api;

// GET /subjects answers 404 when the user simply has no subjects yet.
// Treat that as an empty list, not a failure.
export const fetchSubjects = async () => {
  try {
    const { data } = await api.get("/subjects");
    return data?.data || [];
  } catch (error) {
    if (error.response?.status === 404) return [];
    throw error;
  }
};
