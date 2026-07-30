import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi, TOKEN_KEY, USER_KEY } from "../api/client";

const AuthContext = createContext(null);

function decodeJwtExp(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

function readStoredUser() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);
    if (!token || !raw) return null;

    // Drop an expired JWT before it ever reaches the API.
    const exp = decodeJwtExp(token);
    if (exp && exp < Date.now()) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  const persist = useCallback((data) => {
    const { token, ...profile } = data;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    setUser(profile);
    return profile;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  // The API client fires this when the server rejects our token.
  useEffect(() => {
    const onExpired = () => logout();
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, [logout]);

  const login = useCallback(
    async (email, password) => persist(await authApi.login({ email, password })),
    [persist],
  );

  const register = useCallback(
    async (name, email, password) => persist(await authApi.register({ name, email, password })),
    [persist],
  );

  const value = useMemo(
    () => ({ user, ready, login, register, logout, isAdmin: user?.role === "admin" }),
    [user, ready, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
