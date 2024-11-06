import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type AuthState } from "@/types/store";
import { authApi } from "@/lib/api";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: true,

      initialize: async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            set({ isLoading: false });
            return;
          }

          const user = await authApi.validateToken(token);
          set({ user, token, isLoading: false });
        } catch (error) {
          localStorage.removeItem("token");
          set({ user: null, token: null, isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        const { token, user } = await authApi.login({ email, password });
        localStorage.setItem("token", token);
        set({ token, user, isLoading: false });
      },

      logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token }),
    }
  )
);
