import { StateCreator, StoreMutatorIdentifier } from "zustand";

export const performance =
  <
    T extends object,
    Mps extends [StoreMutatorIdentifier, unknown][] = [],
    Mcs extends [StoreMutatorIdentifier, unknown][] = []
  >(
    f: StateCreator<T, Mps, Mcs>,
    options: {
      name?: string;
      threshold?: number;
    } = {}
  ) =>
  (set: any, get: any, store: any) => {
    const { name = "store", threshold = 16 } = options;

    const measureSet: typeof set = (...args) => {
      const start = performance.now();
      const result = set(...args);
      const end = performance.now();
      const duration = end - start;

      if (duration > threshold) {
        console.warn(
          `🐌 Slow state update in ${name}: ${duration.toFixed(2)}ms`,
          args[0]
        );
      }

      return result;
    };

    return f(measureSet, get, store);
  };
