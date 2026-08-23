import { create } from "zustand";
import { User } from "@/lib/api/auth";
import { setToken, clearToken } from "@/lib/auth/token";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setAuth: (user, token) => {
    setToken(token);
    set({ user, isLoading: false });
  },
  logout: () => {
    clearToken();
    set({ user: null, isLoading: false });
  },
  setLoading: (v) => set({ isLoading: v }),
}));