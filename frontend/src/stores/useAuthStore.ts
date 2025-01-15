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
        const authStorage = localStorage.getItem("auth-storage");
        const token = authStorage ? JSON.parse(authStorage).state.token : null;
        let user = null;
        try {
          set({ isLoading: true });

          if (!token) {
            set({ isLoading: false });
            return;
          }

          try {
            user = await authApi.validateToken();
            // console.log("user at store", user);
            set({ user, token, isLoading: false });
          } catch (error) {
            console.log("auth validation error", error);
            set({ user: null, token: null, isLoading: false });
          }
        } catch (error) {
          console.log("initialization error", error);
          set({ user: null, token: null, isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        const { token, user } = await authApi.login({ email, password });
        set({ token, user, isLoading: false });
      },

      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token }),
    }
  )
);
