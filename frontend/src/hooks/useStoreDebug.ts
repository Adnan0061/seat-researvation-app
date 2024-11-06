import { useRef, useEffect } from "react";
import { type StoreApi } from "zustand";

export function useStoreDebug<T extends object>(
  store: StoreApi<T>,
  name: string
) {
  const previousState = useRef<T>(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe((state) => {
      const changes = Object.entries(state).reduce((acc, [key, value]) => {
        if (previousState.current[key as keyof T] !== value) {
          acc[key] = {
            from: previousState.current[key as keyof T],
            to: value,
          };
        }
        return acc;
      }, {} as Record<string, { from: any; to: any }>);

      if (Object.keys(changes).length > 0) {
        console.group(`[${name}] State Changes`);
        console.log("Changes:", changes);
        console.log("New State:", state);
        console.groupEnd();
      }

      previousState.current = state;
    });

    return unsubscribe;
  }, [store, name]);
}
