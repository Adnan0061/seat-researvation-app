import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema } from "@/lib/schemas";
import { type Event } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { z } from "zod";

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: Event;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => Promise<void>;
}

export function EventForm({ event, open, onClose, onSubmit }: EventFormProps) {
  console.log("event", event);
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: /*event
      ?*/ {
      title: event?.title,
      description: event?.description,
      // date: new Date(event?.date ?? "")?.toISOString()?.slice(0, 16),
      // date: event?.date,
      totalSeats: event?.totalSeats,
      price: event?.price,
    },
    // : {
    //     title: "",
    //     description: "",
    //     date: "",
    //     totalSeats: 0,
    //     price: 0,
    //   },
  });

  const handleSubmit = async (data: EventFormData) => {
    console.log("create event data", data);
    await onSubmit(data);
    onClose();
    form.reset();
  };
  console.log("event", event);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create New Event"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              defaultValue={event?.title}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title:</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              defaultValue={event?.description}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              defaultValue={
                event?.date
                  ? new Date(event.date).toISOString().slice(0, 16)
                  : undefined
              }
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="totalSeats"
                defaultValue={event?.totalSeats}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Seats</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                defaultValue={event?.price}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{event ? "Update" : "Create"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
