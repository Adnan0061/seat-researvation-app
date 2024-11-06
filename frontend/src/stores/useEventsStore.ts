import { create } from "zustand";
import { type EventsState, type EventFilters } from "@/types/store";
import { eventApi } from "@/lib/api";
import {
  logger,
  validator,
  immer,
  createDevtools,
  // performance,
  // createPersist,
} from "@/lib/middleware";
import { performance } from "@/lib/middleware/performance";
import { createPersist } from "@/lib/middleware/persist";

const defaultFilters: EventFilters = {
  query: "",
  startDate: null,
  endDate: null,
  minPrice: null,
  maxPrice: null,
  hasAvailableSeats: false,
};

// Validators
const validators = {
  events: (events: any) => Array.isArray(events),
  filters: (filters: any) => typeof filters === "object" && filters !== null,
};

export const useEventsStore = create<EventsState>()(
  logger(
    validator(
      immer(
        performance(
          createDevtools(
            createPersist(
              (set, get) => ({
                events: [],
                selectedEvent: null,
                filters: defaultFilters,
                isLoading: false,
                error: null,

                fetchEvents: async () => {
                  set({ isLoading: true, error: null });
                  try {
                    const filters = get().filters;
                    const events = await eventApi.getAll({
                      ...filters,
                      startDate: filters.startDate || undefined,
                      endDate: filters.endDate || undefined,
                      minPrice: filters.minPrice || undefined,
                      maxPrice: filters.maxPrice || undefined,
                    });
                    set({ events, isLoading: false });
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
                  get().fetchEvents();
                },

                selectEvent: (event) => {
                  set({ selectedEvent: event });
                },
              }),
              {
                name: "events-storage",
                partialize: (state) => ({
                  filters: state.filters,
                }),
              }
            ),
            { name: "Events Store" }
          ),
          { name: "events", threshold: 100 }
        )
      ),
      validators
    ),
    "events"
  )
);
