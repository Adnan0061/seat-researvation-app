import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash } from "lucide-react";
import { type Event } from "@/types";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { EventForm } from "@/components/admin/EventForm";

export function AdminEventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: () => eventApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: eventApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast({ title: "Event created successfully" });
    },
    onError: () => {
      toast({
        title: "Failed to create event",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) =>
      eventApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast({ title: "Event updated successfully" });
    },
    onError: () => {
      toast({
        title: "Failed to update event",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: eventApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast({ title: "Event deleted successfully" });
    },
    onError: () => {
      toast({
        title: "Failed to delete event",
        variant: "destructive",
      });
    },
  });

  const handleCreate = async (data: Omit<Event, "id">) => {
    await createMutation.mutateAsync(data);
    setIsFormOpen(false);
  };

  const handleUpdate = async (data: Omit<Event, "id">) => {
    if (selectedEvent) {
      await updateMutation.mutateAsync({
        id: selectedEvent.id,
        data,
      });
      setSelectedEvent(null);
      setIsFormOpen(false);
    }
  };

  const handleDelete = async () => {
    if (deleteEventId) {
      await deleteMutation.mutateAsync(deleteEventId);
      setDeleteEventId(null);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Events</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Available Seats</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.title}</TableCell>
              <TableCell>{formatDate(event.date)}</TableCell>
              <TableCell>{event.availableSeats}</TableCell>
              <TableCell>${event.price}</TableCell>
              <TableCell className="flex justify-end gap-1">
                <Button
                  variant="default"
                  size="icon"
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsFormOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  onClick={() => setDeleteEventId(event.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EventForm
        event={selectedEvent ?? undefined}
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedEvent(null);
        }}
        onSubmit={selectedEvent ? handleUpdate : handleCreate}
      />

      <AlertDialog
        open={!!deleteEventId}
        onOpenChange={() => setDeleteEventId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              event and all associated reservations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
