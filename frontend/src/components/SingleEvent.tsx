import { Card, CardTitle, CardHeader, CardContent } from "./ui/card";
import { formatDate } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Event } from "@/types";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";

export default function SingleEvent({ event }: { event: Event }) {
  return (
    <Card key={event.id}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{event.title}</span>
          <Badge variant={event.availableSeats > 0 ? "default" : "secondary"}>
            {event.availableSeats > 0 ? "Available" : "Sold Out"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{event.description}</p>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Date:</span> {formatDate(event.date)}
          </p>
          <p>
            <span className="font-medium">Available Seats:</span>{" "}
            {event.availableSeats}
          </p>
          <p>
            <span className="font-medium">Price:</span> ${event.price}
          </p>
        </div>
        <Link to={`/events/${event.id}`} className="mt-4 inline-block">
          <Button variant="default">View Details</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
