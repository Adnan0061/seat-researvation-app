import { EventSearch } from "@/components/EventSearch";
import { SearchedEventsList } from "@/components/SearchedEventsList";
import { EventFilters } from "@/types/store";
import { useState } from "react";

export function EventsPage() {
  const [filters, setFilters] = useState<EventFilters>(
    JSON.parse(localStorage.getItem("events-storage") || "{}")
  );

  const onFiltersChange = (newFilters: EventFilters) => {
    const clearedFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, value]) => value !== undefined)
    );
    const updatedFilters = { ...filters, ...clearedFilters };
    localStorage.setItem("events-storage", JSON.stringify(updatedFilters));
    setFilters(updatedFilters);
  };

  return (
    <div className="space-y-6">
      <EventSearch onSearch={onFiltersChange} filters={filters} />

      <SearchedEventsList filters={filters} />
    </div>
  );
}
