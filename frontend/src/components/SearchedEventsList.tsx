import { SearchedEvents } from "@/types";
// import { formatDate } from "@/lib/utils";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Badge } from "./ui/badge";
// import { Link } from "@tanstack/react-router";
// import { Button } from "./ui/button";
import { EventFilters } from "@/types/store";
import { useQuery } from "@tanstack/react-query";
import { eventApi } from "@/lib/api";
import { Spinner } from "./ui/spinner";
import SingleEvent from "./SingleEvent";

interface SearchedEventsListProps {
  filters: EventFilters;
}

export function SearchedEventsList({ filters }: SearchedEventsListProps) {
  const {
    data: events,
    isLoading,
    error,
  } = useQuery<SearchedEvents>({
    queryKey: ["searched-events", filters],
    queryFn: () => eventApi.getSearched(filters),
    enabled: !!filters,
  });
  console.log("events", events);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events?.events && events?.events?.length > 0 ? (
        events?.events?.map((event) => (
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
        ))
      ) : (
        <p className="text-center py-12">No events found</p>
      )}
    </div>
  );
}
