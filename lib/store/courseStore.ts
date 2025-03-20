import { create } from "zustand";

interface CourseState {
  // User-specific purchased courses mapping
  userPurchases: Record<string, string[]>; // userId -> array of courseIds
  setUserCoursePurchase: (
    userId: string,
    courseId: string,
    isPurchased: boolean,
  ) => void;
  isCoursePurchased: (userId: string | undefined, courseId: string) => boolean;
  clearUserPurchases: (userId: string) => void;
  syncPurchasesFromServer: (userId: string) => Promise<void>;
}

// Load persisted course purchase state from localStorage with user-specific keys
const loadPersistedCourseState = (): {
  userPurchases: Record<string, string[]>;
} => {
  if (typeof window !== "undefined") {
    try {
      const storedValue = localStorage.getItem("userCoursePurchases");
      return {
        userPurchases: storedValue ? JSON.parse(storedValue) : {},
      };
    } catch (error) {
      console.error("Failed to load persisted course purchase state:", error);
      return { userPurchases: {} };
    }
  }
  return { userPurchases: {} };
};

export const useCourseStore = create<CourseState>((set, get) => ({
  ...loadPersistedCourseState(),

  setUserCoursePurchase: (
    userId: string,
    courseId: string,
    isPurchased: boolean,
  ) => {
    if (!userId) return; // Don't proceed if no userId is provided

    set((state) => {
      // Get current user's purchases or initialize empty array
      const userCourses = state.userPurchases[userId] || [];
      let updatedUserCourses: string[];

      if (isPurchased) {
        // Add course to user's purchased list if not already there
        updatedUserCourses = userCourses.includes(courseId)
          ? userCourses
          : [...userCourses, courseId];
      } else {
        // Remove course from user's purchased list
        updatedUserCourses = userCourses.filter((id) => id !== courseId);
      }

      // Create new userPurchases object with updated courses for this user
      const updatedUserPurchases = {
        ...state.userPurchases,
        [userId]: updatedUserCourses,
      };

      // Persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "userCoursePurchases",
          JSON.stringify(updatedUserPurchases),
        );
      }

      return { userPurchases: updatedUserPurchases };
    });
  },

  isCoursePurchased: (userId: string | undefined, courseId: string) => {
    if (!userId) return false; // If no user ID, course is not purchased

    const userCourses = get().userPurchases[userId] || [];
    return userCourses.includes(courseId);
  },

  clearUserPurchases: (userId: string) => {
    set((state) => {
      const updatedUserPurchases = { ...state.userPurchases };
      delete updatedUserPurchases[userId];

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "userCoursePurchases",
          JSON.stringify(updatedUserPurchases),
        );
      }

      return { userPurchases: updatedUserPurchases };
    });
  },

  // Function to sync purchases from server after login
  syncPurchasesFromServer: async (userId: string) => {
    if (!userId) return;

    try {
      // Fetch user's purchased courses from server
      const response = await fetch(
        `/api/user/purchased-courses?userId=${userId}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user's purchased courses");
      }

      const data = await response.json();
      const purchasedCourseIds = data.courses.map(
        (course: { course_id: string }) => course.course_id,
      );

      // Update the store with fetched courses
      set((state) => {
        const updatedUserPurchases = {
          ...state.userPurchases,
          [userId]: purchasedCourseIds,
        };

        // Persist to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "userCoursePurchases",
            JSON.stringify(updatedUserPurchases),
          );
        }

        return { userPurchases: updatedUserPurchases };
      });
    } catch (error) {
      console.error("Error syncing purchases from server:", error);
    }
  },
}));
