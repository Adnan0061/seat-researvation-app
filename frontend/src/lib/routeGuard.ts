import { AuthContext } from "@/hooks/useAuth";
import { type NavigateOptions, redirect } from "@tanstack/react-router";

export function authGuard(
  options: NavigateOptions,
  context: AuthContext
): { to?: string; replace?: boolean } | true {
  // Get auth status from your store or auth service
  // const authStorage = localStorage.getItem("auth-storage");
  // const isAuthenticated =
  //   JSON.parse(authStorage as string).state.token || false; // Replace with your auth check
  // console.log(
  //   "authStorage",
  //   authStorage,
  //   "isAuthenticated",
  //   !!isAuthenticated,
  //   "context",
  //   context
  // );

  // Define public routes that should redirect when authenticated
  const publicRoutes = ["/login", "/register", "/forgot-password"];

  if (!!context.auth.user && publicRoutes.includes(options.to as string)) {
    throw redirect({ to: "/" });
  }

  return true; // Continue navigation
}
