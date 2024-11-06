import { type Event, type User, type Reservation } from "./index";

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
}

export interface EventsState {
  events: Event[];
  selectedEvent: Event | null;
  filters: EventFilters;
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  setFilters: (filters: Partial<EventFilters>) => void;
  selectEvent: (event: Event | null) => void;
}

export interface EventFilters {
  query: string;
  startDate: string | null;
  endDate: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  hasAvailableSeats: boolean;
}

export interface ReservationState {
  userReservations: Reservation[];
  isLoading: boolean;
  error: string | null;
  fetchUserReservations: () => Promise<void>;
  createReservation: (data: CreateReservationData) => Promise<void>;
}

export interface CreateReservationData {
  eventId: string;
  numberOfSeats: number;
}
