import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router";
import { StoreProvider } from "./providers/StoreProvider";
import { AuthProvider } from "./context/auth-context";
import { Toaster } from "./components/ui/toaster";
import { AuthContext, useAuth } from "./hooks/useAuth";

// const queryClient = new QueryClient();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export function App() {
  const auth = useAuth();
  return (
    <QueryClientProvider client={queryClient}>
      {/* <StoreProvider> */}
      <AuthProvider>
        <RouterProvider router={router} context={{ auth } as AuthContext} />
        <Toaster />
      </AuthProvider>
      {/* </StoreProvider> */}
    </QueryClientProvider>
  );
}
