import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router";
import { StoreProvider } from "./providers/StoreProvider";
import { AuthProvider } from "./context/auth-context";
import { Toaster } from "./components/ui/toaster";

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
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StoreProvider>
          <RouterProvider router={router} />
          <Toaster />
        </StoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
