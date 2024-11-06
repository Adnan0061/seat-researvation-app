import { create } from "zustand";
import { type ReservationState } from "@/types/store";
import { reservationApi } from "@/lib/api";
import { useEventsStore } from "./useEventsStore";

export const useReservationsStore = create<ReservationState>()((set) => ({
  userReservations: [],
  isLoading: false,
  error: null,

  fetchUserReservations: async () => {
    set({ isLoading: true, error: null });
    try {
      const reservations = await reservationApi.getUserReservations();
      set({ userReservations: reservations, isLoading: false });
    } catch (error) {
      console.error(error);
      set({
        error: "Failed to fetch reservations",
        isLoading: false,
      });
    }
  },

  createReservation: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const reservation = await reservationApi.create(data);
      set((state) => ({
        userReservations: [...state.userReservations, reservation],
        isLoading: false,
      }));
      // Refresh events to update available seats
      useEventsStore.getState().fetchEvents();
    } catch (error) {
      console.error(error);
      set({
        error: "Failed to create reservation",
        isLoading: false,
      });
      throw error;
    }
  },
}));
