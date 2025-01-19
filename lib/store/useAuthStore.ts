import { UserInfo } from "@/types/schema";
import { create } from "zustand";
import { login, register } from "../actions/user.actions";

// Helper to load the persisted user data
const loadPersistedUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    return { user: user ? JSON.parse(user) : null, isAuthenticated };
  }
  return { user: null, isAuthenticated: false };
};

export const useAuthStore = create((set) => ({
  user: loadPersistedUser().user,
  token: null,
  isAuthenticated: loadPersistedUser().isAuthenticated,
  error: null,
  loading: false,

  // signup action
  signup: async (data: Partial<UserInfo>) => {
    set({ loading: true });
    try {
      // make api call
      const response = await register(data);
      set({ user: response.data, isAuthenticated: true, loading: false });
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("isAuthenticated", "true");
      return { success: true };
    } catch (error) {
      set({ error, loading: false });
    }
  },

  // login action
  signin: async (data: UserInfo) => {
    const { email, password } = data;
    set({ loading: true });
    try {
      // make api call
      const response = await login({ email, password });
      set({ user: response.data, isAuthenticated: true, loading: false });
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("isAuthenticated", "true");
      return { success: true };
    } catch (error) {
      set({ error, loading: false });
    }
  },

  // logout action
  signout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
  },
}));