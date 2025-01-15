import { create } from "zustand";
import { type EventsState, type EventFilters } from "@/types/store";
import { eventApi } from "@/lib/api";
// import { logger, validator, immer, createDevtools } from "@/lib/middleware";
// import { performance } from "@/lib/middleware/performance";
import { createPersist } from "@/lib/middleware/persist";

const defaultFilters: EventFilters = {
  query: "",
  startDate: undefined,
  endDate: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  hasAvailableSeats: false,
};

// Validators
// const validators = {
//   events: (events: Event[]) => Array.isArray(events),
//   filters: (filters: EventFilters) =>
//     typeof filters === "object" && filters !== null,
// };

export const useEventsStore = create<EventsState>()(
  // logger(
  // validator(
  // immer(
  //   performance(
  //     createDevtools(
  createPersist(
    (set, get) => ({
      events: { events: [], page: 0, total: 0, totalPages: 0 },
      selectedEvent: null,
      filters: defaultFilters,
      isLoading: false,
      error: null,

      fetchEvents: async () => {
        set({ isLoading: true, error: null });
        try {
          const filters = get().filters;
          const events = await eventApi.getSearched({
            ...filters,
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
            minPrice: filters.minPrice || undefined,
            maxPrice: filters.maxPrice || undefined,
          });
          // console.log("events before set", events);
          set({ events: events, isLoading: false });
        } catch (error) {
          console.error(error);
          set({
            error: "Failed to fetch events",
            isLoading: false,
          });
        }
      },

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
        // console.log("setFilters", newFilters);
        get().fetchEvents();
      },

      selectEvent: (event) => {
        set({ selectedEvent: event });
      },
    }),
    {
      name: "events-storage",
      storage: localStorage,
      partialize: (state) => ({
        filters: state.filters,
      }),
    }
  )
  //       { name: "Events Store" }
  //     ),
  //     { name: "events", threshold: 100 }
  //   )
  // )
  //   validators
  // ),
  //   "events"
  // )
);
