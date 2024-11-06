import { useEffect } from "react";
import { useEventsStore } from "@/stores/useEventsStore";
import { useStoreDebug } from "@/hooks/useStoreDebug";
import { EventsList } from "@/components/EventsList";
import { EventSearch } from "@/components/EventSearch";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

export function EventsPage() {
  const store = useEventsStore();

  // Debug store in development
  if (process.env.NODE_ENV === "development") {
    useStoreDebug(useEventsStore, "Events");
  }

  useEffect(() => {
    store.fetchEvents();
  }, []);

  if (store.error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{store.error}</p>
        <Button onClick={store.fetchEvents} variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EventSearch onSearch={store.setFilters} />

      {store.isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <EventsList events={store.events} />
      )}
    </div>
  );
}
