import {
  type Event,
  type User,
  type Reservation,
  SearchedEvents,
} from "./index";

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
}

export interface EventsState {
  events: SearchedEvents;
  selectedEvent: Event | null;
  filters: EventFilters;
  isLoading: boolean;
  error: string | null;
  // initialize: () => Promise<void>;
  fetchEvents: () => Promise<void>;
  setFilters: (filters: Partial<EventFilters>) => void;
  selectEvent: (event: Event | null) => void;
}

export interface EventFilters {
  query?: string;
  startDate?: string | undefined;
  endDate?: string | undefined;
  minPrice?: string | undefined;
  maxPrice?: string | undefined;
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
