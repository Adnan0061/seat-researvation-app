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

export interface SearchedEvents {
  events: Event[];
  page: number;
  total: number;
  totalPages: number;
}

export interface Reservation {
  id: string;
  event: Event;
  userId: string;
  numberOfSeats: number;
  status: "pending" | "confirmed" | "cancelled";
  totalPrice: number;
  createdAt: string;
}
