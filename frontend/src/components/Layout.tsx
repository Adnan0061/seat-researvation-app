import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Outlet } from "@tanstack/react-router";

export function Layout() {
  const { user, logout } = useAuth();
  console.log("user at layout", user);
  return (
    <div className="w-full h-full" data-component="layout">
      <header className="border-b w-full">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary">
            Event Reservation
          </Link>

          <nav className="flex items-center gap-4">
            <Link to="/events" className="text-primary hover:text-primary/70">
              Events
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="icon">
                    <UserCircle className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/events">Manage Events</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/reservations">My Reservations</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button asChild variant="secondary">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
