import { enableMapSet, produce } from "immer";
import { devtools } from "zustand/middleware";
import type {
  LoggerMiddleware,
  ValidatorMiddleware,
  ImmerMiddleware,
  DevtoolsMiddleware,
} from "@/types/middleware";

enableMapSet();

// Logger Middleware
export const logger: LoggerMiddleware =
  (f, name = "store") =>
  (set, get, store) => {
    const loggedSet: typeof set = (...args) => {
      const before = get();
      set(...args);
      const after = get();
      console.group(`${name} - ${new Date().toISOString()}`);
      console.log("Before:", before);
      console.log("After:", after);
      console.log("Action:", args[0]);
      console.groupEnd();
    };

    return f(loggedSet, get, store);
  };

// Validator Middleware
export const validator: ValidatorMiddleware =
  (f, validators = {}) =>
  (set, get, store) => {
    const validatedSet: typeof set = (...args) => {
      const newState = typeof args[0] === "function" ? args[0](get()) : args[0];

      // Validate each field with its corresponding validator
      Object.entries(validators).forEach(([key, validateFn]) => {
        if (key in newState && !validateFn(newState[key])) {
          throw new Error(`Invalid value for ${key}`);
        }
      });

      return set(...args);
    };

    return f(validatedSet, get, store);
  };

// Immer Middleware
export const immer: ImmerMiddleware = (f) => (set, get, store) => {
  const immerSet: typeof set = (...args) => {
    const newState =
      typeof args[0] === "function" ? produce(get(), args[0]) : args[0];

    return set(newState, args[1]);
  };

  return f(immerSet, get, store);
};

// Devtools Middleware with Types
export const createDevtools: DevtoolsMiddleware = (f, options = {}) => {
  const { name = "store", enabled = process.env.NODE_ENV === "development" } =
    options;
  return devtools(f, { name, enabled });
};
