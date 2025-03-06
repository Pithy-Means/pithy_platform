import { create } from "zustand";

interface CourseState {
  lockedCourses: string[]; // Array of course_ids that are locked
  setCourseLockStatus: (courseId: string, isLocked: boolean) => void;
  isCourseUnlocked: (courseId: string) => boolean;
  unlockAllCourses: () => void;
}

// Load persisted course lock state from localStorage
const loadPersistedCourseState = (): { lockedCourses: string[] } => {
  if (typeof window !== "undefined") {
    try {
      const storedValue = localStorage.getItem("lockedCourses");
      return { 
        lockedCourses: storedValue ? JSON.parse(storedValue) : [] 
      };
    } catch (error) {
      console.error("Failed to load persisted course state:", error);
      return { lockedCourses: [] };
    }
  }
  return { lockedCourses: [] };
};

export const useCourseStore = create<CourseState>((set, get) => ({
  ...loadPersistedCourseState(),
  
  setCourseLockStatus: (courseId: string, isLocked: boolean) => {
    set((state) => {
      let updatedCourses: string[];
      
      if (isLocked) {
        // Add course to locked list if not already there
        updatedCourses = state.lockedCourses.includes(courseId) 
          ? state.lockedCourses 
          : [...state.lockedCourses, courseId];
      } else {
        // Remove course from locked list
        updatedCourses = state.lockedCourses.filter(id => id !== courseId);
      }
      
      // Persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("lockedCourses", JSON.stringify(updatedCourses));
      }
      
      return { lockedCourses: updatedCourses };
    });
  },
  
  isCourseUnlocked: (courseId: string) => {
    return !get().lockedCourses.includes(courseId);
  },
  
  unlockAllCourses: () => {
    set({ lockedCourses: [] });
    if (typeof window !== "undefined") {
      localStorage.setItem("lockedCourses", JSON.stringify([]));
    }
  }
}));