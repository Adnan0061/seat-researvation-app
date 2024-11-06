import { Router, Route, RootRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/Home";
import { LoginPage } from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import { EventsPage } from "./pages/Events";
import { EventDetailPage } from "./pages/EventDetail";
import { AdminEventsPage } from "./pages/admin/Events";
import { UserReservationsPage } from "./pages/UserReservations";

const rootRoute = new RootRoute({
  component: Layout,
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

const eventsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/events",
  component: EventsPage,
});

const eventDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/events/$eventId",
  component: EventDetailPage,
  validateParams: (params) => ({
    eventId: z.string().parse(params.eventId),
  }),
});

const adminEventsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/admin/events",
  component: AdminEventsPage,
});

const userReservationsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/reservations",
  component: UserReservationsPage,
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

export const router = new Router({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
