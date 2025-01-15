import axios from "axios";
import { Event, Reservation, SearchedEvents, User } from "@/types";
import { useAuthStore } from "@/stores/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const { data } = await api.post<{ token: string; user: User }>(
      "/auth/login",
      credentials
    );
    // console.log("login data", data);
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
    // console.log("register data", data);
    return data;
  },

  validateToken: async (): Promise<User> => {
    const { data } = await api.get<{ success: boolean; data: User }>(
      "/auth/validate"
    );
    // console.log("validateToken data", data);
    return data.data;
  },
};

export const eventApi = {
  getAll: async (/*-params?: {
    query?: string;
    startDate?: string;
    endDate?: string;
    minPrice?: number;
    maxPrice?: number;
    hasAvailableSeats?: boolean;
  }*/) => {
    // console.log("getAll params", params);
    const { data } = await api.get<Event[]>("/events" /*, { params }*/);
    return data;
  },
  getSearched: async (params?: {
    query?: string;
    startDate?: string;
    endDate?: string;
    minPrice?: string;
    maxPrice?: string;
    hasAvailableSeats?: boolean;
  }) => {
    const { data } = await api.get<SearchedEvents>("/events/search", {
      params,
    });
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
