import { StateCreator, StoreMutatorIdentifier } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface PersistOptions<T> {
  name: string;
  storage?: Storage;
  partialize?: (state: T) => Partial<T>;
  version?: number;
  migrate?: (persistedState: any, version: number) => T | Promise<T>;
}

export const createPersist = <
  T extends object,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: StateCreator<T, Mps, Mcs>,
  options: PersistOptions<T>
) => {
  return persist(f, {
    name: options.name,
    storage: options.storage
      ? createJSONStorage(() => options.storage!)
      : undefined,
    partialize: options.partialize,
    version: options.version,
    migrate: options.migrate,
  });
};
