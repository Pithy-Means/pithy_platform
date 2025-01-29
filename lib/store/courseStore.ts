import { create } from "zustand";

const loadPersistedCourse = (): { isLocked: boolean } => {
  if (typeof window !== "undefined") {
    const storedValue = localStorage.getItem("isLocked");
    const isLocked = storedValue !== null ? storedValue === "true" : true;
    return { isLocked };
  }
  return { isLocked: true };
};

interface CourseState {
  isLocked: boolean;
  setLocked: (state: boolean) => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  ...loadPersistedCourse(),
  setLocked: (state) => {
    if (typeof state !== "boolean") {
      console.error("Invalid state provided to setLocked:", state);
      return;
    }
    set({ isLocked: state });
    if (typeof window !== "undefined") {
      localStorage.setItem("isLocked", state.toString());
    }
  },
}));
