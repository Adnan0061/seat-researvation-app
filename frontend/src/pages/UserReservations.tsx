import { useQuery } from "@tanstack/react-query";
import { reservationApi } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function UserReservationsPage() {
  const { data: reservations, isLoading } = useQuery({
    queryKey: ["user-reservations"],
    queryFn: reservationApi.getUserReservations,
  });

  if (isLoading) {
    return <ReservationsTableSkeleton />;
  }

  if (!reservations?.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No reservations yet</h2>
        <p className="text-muted-foreground">
          You haven't made any reservations. Browse our events and book your
          first one!
        </p>
        <Button className="mt-4" asChild>
          <Link to="/events">Browse Events</Link>
        </Button>
      </div>
    );
  }

  // console.log(reservations);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Reservations</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Seats</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell className="font-medium">
                {reservation.event.title}
              </TableCell>
              <TableCell>{formatDate(reservation.event.date)}</TableCell>
              <TableCell>{reservation.numberOfSeats}</TableCell>
              <TableCell>${reservation.totalPrice}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    reservation.status === "confirmed"
                      ? "default"
                      : reservation.status === "pending"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {reservation.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ReservationsTableSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="border rounded-lg">
        <div className="border-b p-4">
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-4" />
            ))}
          </div>
        </div>
        {[1, 2, 3].map((row) => (
          <div key={row} className="p-4">
            <div className="grid grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-4" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
