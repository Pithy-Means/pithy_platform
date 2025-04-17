import { LoginInfo, UserInfo } from "@/types/schema";
import { create } from "zustand";
import { login, register } from "../actions/user.actions";

interface AuthState {
  user: UserInfo | null;
  setUser: (user: UserInfo) => void; // Added setUser method
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
  signup: (data: Partial<UserInfo>) => Promise<{ success: boolean }>;
  signin: (data: LoginInfo) => Promise<{ success: boolean }>;
  signout: () => void;
  updateUserPaidStatus: (isPaid: boolean) => void; // New method to update paid status
}

const loadPersistedUser = (): Pick<AuthState, "user" | "isAuthenticated"> => {
  if (typeof window === "undefined") {
    return { user: null, isAuthenticated: false };
  }
  const user = localStorage.getItem("user");
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return { user: user ? JSON.parse(user) : null, isAuthenticated };
};

export const useAuthStore = create<AuthState>((set) => ({
  user: loadPersistedUser().user,
  token: null,
  isAuthenticated: loadPersistedUser().isAuthenticated,
  error: null,
  loading: false,

  signup: async (data) => {
    set({ loading: true });
    try {
      const response = await register(data); // API call
      if (!response || !response.success || !response.userinfo) {
        set({ loading: false });
        throw new Error(response.message || "Registration failed");
      }
      const userInfo: UserInfo = {
        ...response.userinfo,
        user_id: response.userinfo.user_id,
        email: response.userinfo.email,
        password: response.userinfo.password,
      };
      set({ user: userInfo, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : String(error),
        loading: false,
      });
      throw error; // To handle errors in the caller function
    }
  },

  signin: async (data) => {
    // const { email, password } = data;
    set({ loading: true });
    try {
      const response = await login(data); // API call
      if (!response.success || !response.data) {
        throw new Error(response.message || "Login failed");
      }
      const { user, token } = response.data;
      set({ user, token, isAuthenticated: true, loading: false });
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isAuthenticated", "true");
      return { success: true };
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : String(error),
        loading: false,
      });
      throw error; // To handle errors in the caller function
    }
  },

  signout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
  },

  updateUserPaidStatus: (isPaid: boolean) => {
    set((state) => {
      if (state.user) {
        const updatedUser = { ...state.user, paid: isPaid };
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        return { user: updatedUser } as Partial<AuthState>;
      }
      return state;
    });
  },

  setUser: (user: UserInfo) => {
    set({ user });
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isAuthenticated", "true");
        return { success: true };
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : String(error),
        loading: false,
      });
      throw error;
    }
  },
}));
