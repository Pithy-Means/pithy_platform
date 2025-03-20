import { create } from "zustand";
import { LoginInfo } from "@/types/schema";

interface AuthState {
  user: LoginInfo | null;
  setUser: (user: LoginInfo) => void;
  clearUser: () => void;
}

const useAuth = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export default useAuth;
