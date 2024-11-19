import { redirect, createRootRoute, createRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/Home";
import { LoginPage } from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import { EventsPage } from "./pages/Events";
import { EventDetailPage } from "./pages/EventDetail";
import { AdminEventsPage } from "./pages/admin/Events";
import { UserReservationsPage } from "./pages/UserReservations";
import { AuthContext } from "./hooks/useAuth";
import { createRouter } from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
  beforeLoad: () => {
    console.log("Loading HomePage route");
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: async ({ context }) => {
    // console.log("location", location);
    // console.log("context", context);
    // // authGuard({ to: location.pathname as "/login" });
    // return authGuard(
    //   { to: location.pathname as "/login" },
    //   context as AuthContext
    // );
    const { auth } = context as AuthContext;
    if (auth.user) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
  beforeLoad: async ({ context }) => {
    // return authGuard(
    //   { to: location.pathname as "/login" },
    //   context as AuthContext
    // );
    const { auth } = context as AuthContext;
    if (auth.user) {
      throw redirect({ to: "/" });
    }
  },
});

const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events",
  component: EventsPage,
});

const eventDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events/$eventId",
  component: EventDetailPage,
  params: z.object({
    eventId: z.string(),
  }),
  // validateParams: (params) => ({
  //   eventId: z.string().parse(params.eventId),
  // }),
});

const adminEventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/events",
  component: AdminEventsPage,
  beforeLoad: ({ context }) => {
    const { auth } = context as AuthContext;
    if (!auth.user || auth.user.role !== "admin") {
      throw redirect({ to: "/" });
    }
  },
});

const userReservationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reservations",
  component: UserReservationsPage,
  beforeLoad: ({ context }) => {
    console.log("context", context);
    const { auth } = context as AuthContext;
    if (!auth.user) {
      throw redirect({ to: "/login" });
    }
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  eventsRoute,
  eventDetailRoute,
  adminEventsRoute,
  userReservationsRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
