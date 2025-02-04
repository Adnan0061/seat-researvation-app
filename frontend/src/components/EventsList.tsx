import { Event } from "@/types";
// import { formatDate } from "@/lib/utils";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Badge } from "./ui/badge";
// import { Link } from "@tanstack/react-router";
// import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { eventApi } from "@/lib/api";
import { Spinner } from "./ui/spinner";
import SingleEvent from "./SingleEvent";

export function EventsList() {
  const {
    data: events,
    isLoading,
    error,
  } = useQuery<Event[]>({
    queryKey: ["all-events"],
    queryFn: () => eventApi.getAll(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-red-500">Error fetching events</p>
      </div>
    );
  }
  // console.log("events", events);
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events &&
        events.map((event) => (
          <SingleEvent key={event.id} event={event} />
          // <Card key={event.id}>
          //   <CardHeader>
          //     <CardTitle className="flex items-center justify-between">
          //       <span>{event.title}</span>
          //       <Badge
          //         variant={event.availableSeats > 0 ? "default" : "secondary"}
          //       >
          //         {event.availableSeats > 0 ? "Available" : "Sold Out"}
          //       </Badge>
          //     </CardTitle>
          //   </CardHeader>
          //   <CardContent>
          //     <p className="text-muted-foreground mb-4">{event.description}</p>
          //     <div className="space-y-2 text-sm">
          //       <p>
          //         <span className="font-medium">Date:</span>{" "}
          //         {formatDate(event.date)}
          //       </p>
          //       <p>
          //         <span className="font-medium">Available Seats:</span>{" "}
          //         {event.availableSeats}
          //       </p>
          //       <p>
          //         <span className="font-medium">Price:</span> ${event.price}
          //       </p>
          //     </div>
          //     <Link to={`/events/${event.id}`} className="mt-4 inline-block">
          //       <Button variant="default">View Details</Button>
          //     </Link>
          //   </CardContent>
          // </Card>
        ))}
    </div>
  );
}
