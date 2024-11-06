import axios from "axios";
import { Event, Reservation, User } from "@/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const { data } = await api.post<{ token: string; user: User }>(
      "/auth/login",
      credentials
    );
    return data;
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    const { data } = await api.post<{ token: string; user: User }>(
      "/auth/register",
      userData
    );
    return data;
  },
};

export const eventApi = {
  getAll: async (params?: {
    query?: string;
    startDate?: string;
    endDate?: string;
    minPrice?: number;
    maxPrice?: number;
    hasAvailableSeats?: boolean;
  }) => {
    const { data } = await api.get<Event[]>("/events", { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<Event>(`/events/${id}`);
    return data;
  },

  create: async (eventData: Omit<Event, "id">) => {
    const { data } = await api.post<Event>("/events", eventData);
    return data;
  },

  update: async (id: string, eventData: Partial<Event>) => {
    const { data } = await api.put<Event>(`/events/${id}`, eventData);
    return data;
  },

  delete: async (id: string) => {
    await api.delete(`/events/${id}`);
  },
};

export const reservationApi = {
  create: async (reservationData: {
    eventId: string;
    numberOfSeats: number;
  }) => {
    const { data } = await api.post<Reservation>(
      "/reservations",
      reservationData
    );
    return data;
  },

  getUserReservations: async () => {
    const { data } = await api.get<Reservation[]>("/reservations");
    return data;
  },
};
