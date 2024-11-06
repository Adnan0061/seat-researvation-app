import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useEventsStore } from "@/stores/useEventsStore";
import { EventsList } from "@/components/EventsList";
import { ArrowRight, Calendar } from "lucide-react";

export function HomePage() {
  //   const { events } = useEventsStore((state) => ({
  //     events: state.events.slice(0, 3), // Show only first 3 events
  //   }));
  //   console.log("Events from store:", events);
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Find and Book Amazing Events
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover upcoming events, reserve your seats, and create unforgettable
          memories.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/events">
              Browse Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/register">Sign Up Now</Link>
          </Button>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">Featured Events</h2>
          <Button variant="ghost" asChild>
            <Link to="/events">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* {events && <EventsList events={events} />} */}
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <Calendar className="h-8 w-8 text-primary" />
          <h3 className="text-xl font-semibold">Easy Booking</h3>
          <p className="text-muted-foreground">
            Book your tickets in minutes with our simple reservation system.
          </p>
        </div>
        <div className="space-y-4">
          <Calendar className="h-8 w-8 text-primary" />
          <h3 className="text-xl font-semibold">Diverse Events</h3>
          <p className="text-muted-foreground">
            From concerts to workshops, find events that match your interests.
          </p>
        </div>
        <div className="space-y-4">
          <Calendar className="h-8 w-8 text-primary" />
          <h3 className="text-xl font-semibold">Secure Payments</h3>
          <p className="text-muted-foreground">
            Your transactions are protected with industry-standard security.
          </p>
        </div>
      </section>
    </div>
  );
}
