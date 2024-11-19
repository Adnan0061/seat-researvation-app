import { createContext, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    user,
    // token,
    login: storeLogin,
    logout: storeLogout,
    initialize,
    isLoading,
  } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = async (email: string, password: string) => {
    await storeLogin(email, password);
  };

  const logout = () => {
    storeLogout();
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
