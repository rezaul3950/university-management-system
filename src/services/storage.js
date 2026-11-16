import { STORAGE_KEYS } from "@/utils/constants";

export const storage = {
  get(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  getToken() {
    return this.get(STORAGE_KEYS.TOKEN);
  },
  setToken(token) {
    this.set(STORAGE_KEYS.TOKEN, token);
  },
  getUser() {
    return this.get(STORAGE_KEYS.USER);
  },
  setUser(user) {
    this.set(STORAGE_KEYS.USER, user);
  },
  clearAuth() {
    this.remove(STORAGE_KEYS.TOKEN);
    this.remove(STORAGE_KEYS.USER);
  },
};