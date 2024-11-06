import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { eventApi, reservationApi } from "@/lib/api";
import { ReservationForm } from "@/components/ReservationForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/context/auth-context";
import { formatDate } from "@/lib/utils";
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

export function EventDetailPage() {
  const { eventId } = useParams({ from: "/events/$eventId" });
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => eventApi.getById(eventId),
  });

  const reserveMutation = useMutation({
    mutationFn: reservationApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      queryClient.invalidateQueries({ queryKey: ["user-reservations"] });
      toast({ title: "Reservation successful!" });
    },
    onError: () => {
      toast({
        title: "Failed to make reservation",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <EventDetailSkeleton />;
  }

  if (error || !event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Event not found</h2>
        <p className="text-muted-foreground">
          The event you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <p className="text-muted-foreground">{event.description}</p>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span>
                {event.availableSeats} seats available
                {event.availableSeats === 0 && " (Sold Out)"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Venue Location</span>
            </div>
          </div>

          {/* Additional event details can go here */}
        </div>

        <div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold">${event.price}</div>
                <div className="text-sm text-muted-foreground">per person</div>
              </div>

              {user ? (
                <ReservationForm
                  event={event}
                  onSubmit={reserveMutation.mutateAsync}
                />
              ) : (
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login">Login to Reserve</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function EventDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div>
            <Skeleton className="h-10 w-2/3 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-16 w-full mb-4" />
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
