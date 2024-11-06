import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export function useAuth() {
  const store = useAuthStore();

  useEffect(() => {
    store.initialize();
  }, []);

  return {
    user: store.user,
    isLoading: store.isLoading,
    login: store.login,
    logout: store.logout,
  };
}

export interface AuthContext {
  auth: ReturnType<typeof useAuth>;
}
