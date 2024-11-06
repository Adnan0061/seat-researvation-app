import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reservationSchema } from "@/lib/schemas";
import { type Event } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";

type ReservationFormData = z.infer<typeof reservationSchema>;

interface ReservationFormProps {
  event: Event;
  onSubmit: (data: ReservationFormData) => Promise<void>;
}

export function ReservationForm({ event, onSubmit }: ReservationFormProps) {
  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      eventId: event.id,
      numberOfSeats: 1,
    },
  });

  const numberOfSeats = form.watch("numberOfSeats");
  const totalPrice = event.price * numberOfSeats;

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="numberOfSeats"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Seats</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={event.availableSeats}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Price per seat:</span>
                <span>${event.price}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total price:</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={event.availableSeats === 0}
            >
              {event.availableSeats === 0 ? "Sold Out" : "Reserve Seats"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
