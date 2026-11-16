import { createContext, useCallback, useMemo, useState } from "react";
import { storage } from "@/services/storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser());

  const login = useCallback(({ user: nextUser, token }) => {
    storage.setToken(token);
    storage.setUser(nextUser);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    storage.clearAuth();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}