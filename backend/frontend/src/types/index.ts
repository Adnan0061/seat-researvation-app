export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
}

export interface Reservation {
  id: string;
  eventId: string;
  userId: string;
  numberOfSeats: number;
  status: "pending" | "confirmed" | "cancelled";
  totalPrice: number;
  createdAt: string;
}
